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

            const filePath = `.\\data\\${fileName}`;
            this.ipc.send("readFile", filePath);
        });
    }
}
