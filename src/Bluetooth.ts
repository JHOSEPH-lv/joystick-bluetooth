interface IConstructor {
    name: string;
    service_id: number;
    characteristic_id: number;
    onReceive: (event: Event) => void;
    onDisconnect: (event: Event) => void;
}

class Bluetooth {
    name: string;
    service_id: number
    characteristic_id: number
    onReceive: (event: Event) => void;
    onDisconnect: (event: Event) => void;
    device?: BluetoothDevice;
    characteristic?: BluetoothRemoteGATTCharacteristic;
    
    constructor({name,service_id,characteristic_id, onReceive, onDisconnect}:IConstructor){
        this.name               = name; // CONTROLLER
        this.service_id         = service_id; // 0xffe0
        this.characteristic_id  = characteristic_id; // 0xffe1
        this.onReceive          = onReceive; // función recibir
        this.onDisconnect       = onDisconnect; // función recibir
    }

    async connect(){
        try {
            this.device = await navigator.bluetooth.requestDevice({
                filters: [
                    {namePrefix: this.name}
                ],
                optionalServices: [this.service_id]
            })
            // console.log(this.device);

            
            const server = await this.device?.gatt?.connect();
            // console.log(server);
            
            const service = await server?.getPrimaryService(this.service_id);
            // console.log(service);
            
            this.characteristic = await service?.getCharacteristic(this.characteristic_id);
            // console.log(this.characteristic);
        } catch (error) {
            console.warn(error);
            return false;
        }

        this.device.addEventListener('gattserverdisconnected', this.onDisconnect)
        
        this.characteristic?.addEventListener('characteristicvaluechanged', this.onReceive);
        
        this.characteristic?.startNotifications();
        
        return true;
    }

    async disconnect(){
        this.device?.gatt?.disconnect();
    }

    send(message:string){
        // verificar si GATT no está en progress
        const encoder = new TextEncoder();
        const message_encode = encoder.encode(message+'\n');
        console.log(`BleController send: ${message}`);
        this.characteristic?.writeValue(message_encode);
    }

}

export default Bluetooth;