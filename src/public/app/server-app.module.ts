import { NgModule } from '@angular/core'
import { App } from './app.component'
import { MainModule } from './main.module'
import { BrowserModule } from '@angular/platform-browser'
import { ServerModule } from '@angular/platform-server'
import { TransferState } from './modules/transfer-state/transfer-state'
import { ServerTransferStateModule } from './modules/transfer-state/server-transfer-state.module'

@NgModule({
    bootstrap: [ App ],
    imports: [
        BrowserModule.withServerTransition({
            appId: 'my-app-id'
        }),
        ServerModule,
        ServerTransferStateModule,
        MainModule
    ],
})
export class ServerAppModule {
    constructor(private transferState: TransferState) {}

    // Gotcha
    ngOnBootstrap = () => {
        this.transferState.inject()
    }
}
