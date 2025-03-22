//Attributi statici
let form = document.forms[0];
let immagineGioco = document.getElementById("immagineGioco");
let bottoni = document.getElementById("bottoni");
let parola = document.getElementById("parola");
let divGioco = document.getElementById("gioco");
let divFinePartita = document.getElementById("end");



class Giocatore {
    nickname = "";
    round = 0;
    roundVinti = 0;
    constructor(nickname) {
        this.nickname = nickname;
    }
    
    refreshProprietaOnGame(){
        document.getElementById("giocatore").innerHTML = this.nickname;
        document.getElementById("persi").innerHTML = ""+this.getRoundPersi();
        document.getElementById("vinti").innerHTML = ""+this.getRoundVinti();


    }
    getRound() {
        return this.round;
    }
    getRoundVinti() {
        return this.roundVinti;
    }
    getRoundPersi(){
        return this.round-this.roundVinti;
    }
    getNickname() {
        return this.nickname;
    }
    roundVinto(){
        this.roundVinti++;
        this.round++;

    }
    roundPerso(){
        this.round++;
    }


}

class Generatore {
    listaParole = [];

    static data;

    constructor(listaParole) {
        this.listaParole = listaParole;
    }

    /**
     * 
     * @returns {string}
     */
    estraiParola() {
        return this.listaParole[Math.floor(Math.random()*this.listaParole.length)];
    }




    /**
     * 
     * @returns {Generatore}
     */
    static getSampleData(){
        let lista = ["ciao", "bene", "molto", "buonissimo", "cane", "gatto", "mamma", , "papa", "patata", "patate", "leone", "lupo", "ghepardo", "sasso", "pietra", "masso", "penna", "matita",
            "dado", "australia", "europa", "america", "gattopardo"
        ];
        return new Generatore(lista);
    }

    /**
     * 
     * @returns {Generatore}
     */
    static getData(){
        if (this.data == null) {
            this.data = Generatore.getSampleData();
        }
        return this.data;
    }

    
}

class GiocoImpiccato {
    /**
     * @type {Giocatore}
     */
    giocatore;
    /**
     * @type {Generatore}
     */
    generatore;
    static immagini = ["immagini/HangMan_01.gif", "immagini/HangMan_02.gif", "immagini/HangMan_03.gif", "immagini/HangMan_04.gif", "immagini/HangMan_05.gif", "immagini/HangMan_06.gif", "immagini/HangMan_07.gif", "immagini/HangMan_08.gif", "immagini/HangMan_09.gif", "immagini/HangMan_10.gif"];
    static immagineVittoria = "immagini/HangMan_WIN.gif"
    static immagineSconfitta = "immagini/HangMan_LOSE.gif";




    
    parolaAttuale = "";
    stringaIndovinata = "";
    sbagli = 0;
    contatoreTimer = 0;
    intervalTimerId;

    constructor(giocatore, generatore) {
        this.giocatore = giocatore;
        this.generatore = generatore;
        giocatore.refreshProprietaOnGame();
        
    }
    
    getGiocatore() {
        return this.giocatore;
    }
    getGeneratore(){
        return this.generatore;
    }
    

    nuovoRound() {
        this.giocatore.refreshProprietaOnGame();
        divFinePartita.innerHTML = "";
        divGioco.style.display  = "flex";

        
        this.parolaAttuale = this.generatore.estraiParola();
        this.stringaIndovinata = "";
        let inGrafica = "";
        for (let i = 0; i < this.parolaAttuale.length; i++) {
            this.stringaIndovinata += "_";
            inGrafica+= "_ "
        }
        parola.innerHTML = inGrafica;
        this.sbagli = 0;
        GiocoImpiccato.cambiaImmagine(this);
        GiocoImpiccato.generaBottoni();
        this.contatoreTimer = 0;
        document.getElementById("tempo").innerHTML = this.contatoreTimer;
        this.intervalTimerId = setInterval(gioco.aumentaTimer.bind(this), 1000);
        return this.stringaIndovinata;

    }

    indovina(carattere) {
        let trovata = false;
        for (let i = 0; i < this.parolaAttuale.length; i++) {
            if (this.parolaAttuale[i] == carattere) {
                let tmp = this.stringaIndovinata.slice(0, i);
                tmp += carattere;
                tmp += this.stringaIndovinata.slice(i+1, this.stringaIndovinata.length);
                trovata = true;
                this.stringaIndovinata = tmp;

            }
        }
        
        let inGrafica = "";
        for (let i = 0; i < this.stringaIndovinata.length; i++) {
            inGrafica+=this.stringaIndovinata.charAt(i)
            inGrafica+=" "
        }
        parola.innerHTML = inGrafica;
        if (this.parolaAttuale == this.stringaIndovinata) {
            this.vittoria();
            return;
        }
        
        if (!trovata) {
            this.sbagli++;
            if (this.sbagli==10) {
                this.sconfitta();
                return;
            }
            GiocoImpiccato.cambiaImmagine(this);
        }
    }

    

    aumentaTimer(){
        this.contatoreTimer+=1;
        document.getElementById("tempo").innerHTML = this.contatoreTimer;
    }
    
    stopTimer(){
        clearInterval(this.intervalTimerId);
    }

    static cambiaImmagine(gioco){
        immagineGioco.src = GiocoImpiccato.immagini[gioco.sbagli];
        immagineGioco.alt = "Immagine Impiccato - " + gioco.sbagli;
    }

    static generaBottoni(){
        let alfabeto = "abcdefghijklmnopqrstuvwxyz";
        bottoni.innerHTML = "";
        let bottone = "";

        for (let i = 0; i < alfabeto.length; i++) {
            bottone = document.createElement("button")
            bottone.innerHTML = alfabeto[i];
            bottoni.appendChild(bottone);
            bottone.addEventListener("click", (event) => {
                let bt = event.srcElement;
                gioco.indovina(bt.innerHTML)
                bt.disabled = true;

            })
            


        }
        

    }

    vittoria(){
        divGioco.style.display = "none";
        this.stopTimer();
        let imgVittoria = document.createElement("img");
        imgVittoria.src  = "immagini/HangMan_WIN.gif";
        imgVittoria.alt  = "Vittoria!";
        divFinePartita.append(imgVittoria);
        let p = document.createElement("p");
        p.innerHTML = "Hai vinto! <br>La parola era: "  + this.parolaAttuale;
        p.innerHTML+= "<br>Tempo impiegato: " + this.contatoreTimer + " secondi";
        divFinePartita.append(p);
        divFinePartita.append(GiocoImpiccato.buttonNextGame());
        this.giocatore.roundVinto();
        this.giocatore.refreshProprietaOnGame();

    }
    sconfitta(){
        divGioco.style.display = "none";
        divGioco.classList.add("nascondi");
        this.stopTimer();
        let imgSconfitta = document.createElement("img");
        imgSconfitta.src  = "immagini/HangMan_LOSE.gif";
        imgSconfitta.alt  = "Sconfitta";
        divFinePartita.append(imgSconfitta);
        let p = document.createElement("p");
        p.innerHTML = "Hai perso. <br>La parola era: "  + this.parolaAttuale;
        p.innerHTML+= "<br>Tempo impiegato: " + this.contatoreTimer + " secondi";
        divFinePartita.append(p);
        divFinePartita.append(GiocoImpiccato.buttonNextGame());
        this.giocatore.roundPerso();
        this.giocatore.refreshProprietaOnGame();


    }

    static buttonNextGame(){
        let bt = document.createElement("button")
        bt.addEventListener("click", () => {
            gioco.nuovoRound();
        })
        bt.innerHTML = "Prossimo round"
        return bt;


    }
}

let giocatore;
let gioco;
divGioco.style.display = "none"




form.addEventListener("submit", (event) => {
    event.preventDefault();
    let nickname = form["nickname"].value;
    if (!/\w+/.test(nickname)) {
        document.getElementById("errore").innerHTML = "Inserire un nickname valido";
        return;
    }
    giocatore = new Giocatore(nickname);
    gioco = new GiocoImpiccato(giocatore, Generatore.getData());
    form.style.display = "none";

    gioco.nuovoRound();

})



