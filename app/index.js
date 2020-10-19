const { app, BrowserWindow, Menu } = require('electron');
const fetch = require('node-fetch');
const Alert = require("electron-alert");
const screen = require('electron').screen
//require('electron-reload')(__dirname);
// let Ant = require('ant-plus');

async function isOnline(){
    try {
        const resp = await fetch('https://www.policumbent.it/whpsc_sim_backend/online.php');
        const data = await resp.json();
        return data.online;
    }
    catch (e) {
        return false;
    }
}

const notOnline = () => {
    console.log('check online')
    let alert = new Alert();

    let swalOptions = {
        title: "Event is ended!",
        text: "You aren't online or virtual WHPSC event is ended!",
        type: "error",
        showCancelButton: false
    };

    let promise = alert.fireFrameless(swalOptions, null, true, false);
    promise.then( () => app.quit())
}

const createWindow = async () => {
    const { width, height } = screen.getPrimaryDisplay().workAreaSize;
    window = new BrowserWindow({
        width: Math.round(width * 2/3),
        height: Math.round(height * 4/5),
        webPreferences: {
            experimentalFeatures: true,
            nodeIntegration: true
        }
    });
    await window.loadFile('app/public/empty.html')
    //build menu from the template
    const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu);
    const online = await isOnline();
    await window.loadFile(online ? 'app/public/index.html' : 'app/public/empty.html');

    //Quit app when closed
    window.on('closed', ()=>app.quit());


    if(!online)
        notOnline();
};

let window = null;
app.allowRendererProcessReuse = false;
// app.commandLine.appendSwitch('enable-features', 'ExperimentalWebPlatform');
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
        createWindow().then()
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
            },
            {
                role: 'reload'
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
        }
        ]
    });
}
