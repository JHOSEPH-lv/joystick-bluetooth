import { startOrientation } from "./startOrientation";


interface IDeviceOrientationEvent {
    requestPermission: () => Promise<PermissionState>;
}

export async function requestPermission() {
    if (
        typeof DeviceOrientationEvent !== "undefined" &&
        (DeviceOrientationEvent as unknown as IDeviceOrientationEvent).requestPermission) {
        try {
            const permission = await (DeviceOrientationEvent as unknown as IDeviceOrientationEvent).requestPermission();
            if (permission === "granted") {
                startOrientation();
            } else {
                console.log("Permiso denegado.");
            }
        } catch (error) {
            console.error("Error al solicitar permiso:", error);
        }
    } else {
        startOrientation();
    }
}
