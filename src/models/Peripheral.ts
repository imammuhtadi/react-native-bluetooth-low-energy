export class Peripheral {
  id: string;
  name: string;
  rssi: number;
  advertisementData: any;

  constructor(id: string, name: string, rssi: number, advertisementData: any) {
    this.id = id;
    this.name = name || 'Unknown';
    this.rssi = rssi;
    this.advertisementData = advertisementData;
  }

  toString(): string {
    return `Peripheral: ${this.name} (${this.id}) - RSSI: ${this.rssi}`;
  }
}
