using System;
using System.Linq;
using System.Runtime.InteropServices;
using System.Threading.Tasks;
using Windows.Foundation;
using Windows.Security.Credentials.UI;

internal static class WindowsHelloHelper
{
    private const string FactoryIid = "39E050C3-4E74-441A-8DC0-B81104DF949C";

    [DllImport("combase.dll", CharSet = CharSet.Unicode)]
    private static extern int WindowsCreateString(string sourceString, int length, out IntPtr hstring);

    [DllImport("combase.dll")]
    private static extern int WindowsDeleteString(IntPtr hstring);

    [DllImport("combase.dll")]
    private static extern int RoGetActivationFactory(IntPtr activatableClassId, ref Guid iid, out IUserConsentVerifierInterop factory);

    [ComImport]
    [Guid(FactoryIid)]
    [InterfaceType(ComInterfaceType.InterfaceIsIUnknown)]
    private interface IUserConsentVerifierInterop
    {
        IntPtr QueryInterface(ref Guid riid);
        uint AddRef();
        uint Release();
        IntPtr GetIids(out int count, out IntPtr iids);
        IntPtr GetRuntimeClassName(out IntPtr className);
        IntPtr GetTrustLevel(out int trustLevel);

        int RequestVerificationForWindowAsync(
            IntPtr appWindow,
            [MarshalAs(UnmanagedType.HString)] string message,
            ref Guid riid,
            out IntPtr asyncOperation);
    }

    private static async Task<T> AwaitWinRt<T>(IAsyncOperation<T> operation)
    {
        var extensionType = Type.GetType("System.WindowsRuntimeSystemExtensions, System.Runtime.WindowsRuntime");
        var method = extensionType.GetMethods()
            .Where(candidate => candidate.Name == "AsTask" && candidate.IsGenericMethodDefinition && candidate.GetParameters().Length == 1)
            .First()
            .MakeGenericMethod(typeof(T));
        var task = (Task)method.Invoke(null, new object[] { operation });
        await task.ConfigureAwait(false);
        return (T)task.GetType().GetProperty("Result").GetValue(task, null);
    }

    private static IAsyncOperation<UserConsentVerificationResult> Request(IntPtr hwnd, string message)
    {
        IntPtr className = IntPtr.Zero;
        IntPtr operation = IntPtr.Zero;
        try
        {
            const string classNameText = "Windows.Security.Credentials.UI.UserConsentVerifier";
            var createHr = WindowsCreateString(classNameText, classNameText.Length, out className);
            if (createHr < 0) Marshal.ThrowExceptionForHR(createHr);
            var factoryIid = new Guid(FactoryIid);
            IUserConsentVerifierInterop factory;
            var getFactoryHr = RoGetActivationFactory(className, ref factoryIid, out factory);
            if (getFactoryHr < 0) Marshal.ThrowExceptionForHR(getFactoryHr);
            var operationIid = typeof(IAsyncOperation<UserConsentVerificationResult>).GUID;
            var requestHr = factory.RequestVerificationForWindowAsync(hwnd, message, ref operationIid, out operation);
            if (requestHr < 0) Marshal.ThrowExceptionForHR(requestHr);
            var projected = (IAsyncOperation<UserConsentVerificationResult>)Marshal.GetObjectForIUnknown(operation);
            operation = IntPtr.Zero;
            return projected;
        }
        finally
        {
            if (operation != IntPtr.Zero) Marshal.Release(operation);
            if (className != IntPtr.Zero) WindowsDeleteString(className);
        }
    }

    private static string MapResult(UserConsentVerificationResult result)
    {
        switch (result)
        {
            case UserConsentVerificationResult.Verified: return "VERIFIED";
            case UserConsentVerificationResult.DeviceNotPresent: return "DEVICE_NOT_PRESENT";
            case UserConsentVerificationResult.NotConfiguredForUser: return "NOT_CONFIGURED";
            case UserConsentVerificationResult.DisabledByPolicy: return "DISABLED_BY_POLICY";
            case UserConsentVerificationResult.RetriesExhausted: return "RETRIES_EXHAUSTED";
            case UserConsentVerificationResult.Canceled: return "CANCELED";
            case UserConsentVerificationResult.DeviceBusy: return "DEVICE_BUSY";
            default: return "UNAVAILABLE";
        }
    }

    private static int Main(string[] args)
    {
        if (args.Length < 2 || !string.Equals(args[0], "--verify", StringComparison.OrdinalIgnoreCase))
        {
            Console.Error.WriteLine("USAGE");
            return 64;
        }
        long hwndValue;
        if (!long.TryParse(args[1], System.Globalization.NumberStyles.HexNumber, null, out hwndValue))
        {
            Console.Error.WriteLine("INVALID_HWND");
            return 64;
        }
        try
        {
            var result = AwaitWinRt(Request(new IntPtr(hwndValue), "Verifikasi Windows Hello untuk membuka PassSa."))
                .GetAwaiter().GetResult();
            Console.WriteLine(MapResult(result));
            return result == UserConsentVerificationResult.Verified ? 0 : 2;
        }
        catch (Exception error)
        {
            Console.Error.WriteLine(error.GetBaseException().Message);
            return 1;
        }
    }
}
