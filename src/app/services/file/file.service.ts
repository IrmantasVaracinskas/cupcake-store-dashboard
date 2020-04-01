import { Injectable } from '@angular/core';
import { IpcRenderer } from 'electron'

@Injectable({
    providedIn: 'root'
})
export class FileService {
    private ipc: IpcRenderer
    constructor() {
        if ((<any>window).require) {
            try {
                this.ipc = (<any>window).require('electron').ipcRenderer
            } catch (error) {
                throw error
            }
        } else {
            console.warn('Could not load electron ipc');
        }
   }

    async readFile(fileName: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this.ipc.once('readFileResponse', (event, arg) => {
                resolve(arg);
            });

            const filePath = `C:\\Users\\irmantas\\Downloads\\b4cdc97fc2cd8826f581a2c2c059ba4a-96fa6b397fa457c59a8ff1a328c3b37df48ebce9\\${fileName}`;
            this.ipc.send("readFile", filePath);
        });
    }
}
