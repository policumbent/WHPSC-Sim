const { app, BrowserWindow, Menu } = require('electron');
//require('electron-reload')(__dirname);
// let Ant = require('ant-plus');

const createWindow = () => {
    // const { width, height } = screen.getPrimaryDisplay().workAreaSize;

    window = new BrowserWindow({
        width: 1080,
        height: 720,
        webPreferences: {
            nodeIntegration: true
        }
    });

    window.loadFile('app/public/index.html');

    //Quit app when closed
    window.on('closed', ()=>app.quit());

    //build menu from the template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
};

let window = null;
app.allowRendererProcessReuse = false;
app.whenReady().then(createWindow);
app.on('window-all-closed', () => {
    // Su macOS è comune che l'applicazione e la barra menù
    // restano attive finché l'utente non esce espressamente tramite i tasti Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit()
    }
});

app.on('activate', () => {
    // Su macOS è comune ri-creare la finestra dell'app quando
    // viene cliccata l'icona sul dock e non ci sono altre finestre aperte.
    if (BrowserWindow.getAllWindows().length === 0) {
        createWindow()
    }
});

// create menu
const mainMenuTemplate = [
    {
        label: 'File',
        submenu:[
            // {
            //     label: 'Settings',
            //     click() {
            //         // createSettingsWindow();
            //     }
            // },
            {
                label: 'Quit',
                accelerator: process.platform === 'darwin' ? 'command+Q' : 'ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
];

if(process.env.NODE_ENV !== 'production'){
    mainMenuTemplate.push({
        label: 'Developer Tools',
        submenu: [{
            label: 'Toggle DevTools',
            accelerator: process.platform === 'darwin' ? 'command+I' : 'ctrl+I',
            click(item, focusedWindow) {
                focusedWindow.webContents.toggleDevTools();
            }
        },{
            role: 'reload'
        }
        ]
    });
}
