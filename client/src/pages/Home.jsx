import Main from "./Main.jsx";
document.addEventListener("DOMContentLoaded",() =>{
    const app = document.createElement('div');

    app.id = app;

    document.body.appendChild(app);
    app.appendChild(Main());
});

export default function Home(){
    return null;
};