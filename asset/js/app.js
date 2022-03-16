// variable URL 
const urlGet ='http://ludivinecrepin.fr/api/pony-get.php'
let html =''
let app = undefined;
// fonctions

function urlId(id)
{
    return 'http://ludivinecrepin.fr/api/pony-get-id.php/'+id
}

// onClick='addData()
function poneyForm(poneyDetail)
{
    const formDiv = document.createElement('div');    
    let title = 'Ajouter un poney';
    if (poneyDetail !== undefined){
        title = `Modifier les information de ${poneyDetail.name}`;
        nameForHtml = poneyDetail.name;
        colorForHtml = poneyDetail.color;
        ageForHtml = poneyDetail.age;
    } else {
        nameForHtml = '';
        colorForHtml = '';
        ageForHtml = '';
    }
    let html = `
    <div> 
        <h1>${title}</h1>  
        <form id='form'>

            <label for="name">Nom du poney : </label>
            <input type="text" id="name" name="name" value='${nameForHtml}' placeholder='Ex : petitTonnaire'>

            <label for="color">Couleur du poney</label>
            <input type="text" id="color" name="color" value='${colorForHtml}' placeholder='Ex : noir'>

            <label for="age">Age du poney</label>
            <input type="number" id="age" name="number" value='${ageForHtml}'' placeholder='Ex : 25'>
            <div class='parent'>
            <button type='button' id='envoyer'>envoyer</button>
            </div>
        
        </form>
    </div>
    `;
    formDiv.innerHTML = html;
    return formDiv;
}

// reset de la div app
async function reset(){
    document.body.innerHTML = `<div class='wrap' id="app"></div>`;    
    app = document.querySelector('#app'); 
}
// page d'accueil
async function home()
{   
    reset();
    initializationCall(urlGet)  // initialization
    app = document.querySelector('#app')    
    console.log(app)
    app.appendChild(poneyForm());
    sendForm()

}
// appel la fonction home() lors d'un clik sur le bouton retour
function registerBtnBack(){
    const btnBack = document.querySelector('#back')
    btnBack.addEventListener('click', () => home())
}

function sendForm(){
    const btn = document.querySelector('#envoyer')
    const name = document.querySelector('#name')
    const age = document.querySelector('#age')
    const color = document.querySelector('#color')
    btn.addEventListener('click', () =>  {
        console.log('form');
        console.log(name.value);
        console.log(age.value);
        console.log(color.value);
        
        addJsonData(name.value,color.value,age.value)
    })    
}
// TODO: creation div content pour un poney
function divPoney(poney)
{        
    // <div id='${poney.id}' class='content'>
    //     <div class='name'> Nom : ${poney.name}</div>
    //     <div class='color'>Couleur : ${poney.color}</div>
    //     <div class='age'> Age : ${poney.age}</div>
    // </div>
    const divPoney = document.createElement('div');
    divPoney.className = 'content';
    divPoney.setAttribute('id', String(poney.id));
    const divPoneyName = document.createElement('div')
    divPoneyName.className = 'name';
    divPoneyName.textContent = `Nom : ${poney.name}`;
    divPoney.appendChild(divPoneyName);
    const divPoneyCouleur = document.createElement('div')
    divPoneyCouleur.className = 'color';
    divPoneyCouleur.textContent = `Couleur : ${poney.color}`;
    divPoney.appendChild(divPoneyCouleur);
    const divPoneyAge = document.createElement('div')
    divPoneyAge.className = 'age';
    divPoneyAge.textContent = `Age : ${poney.age}`;
    divPoney.appendChild(divPoneyAge);

    divPoney.addEventListener('click', () => {
        // on recup l'id du contenu pour genère le detail e l'url
        const url =  urlId(poney.id)
        fetch(url)
        .then(function(reponse){
            return reponse.json();
        })
        .then(function(poneyDetail){
            console.log(poneyDetail);
            reset();
            app.appendChild(poneyDetailHtml(poneyDetail));
            app.appendChild(detailMenu());
            // modifié les info du ponney
            const btnModify = document.querySelector('#modify')
            btnModify.addEventListener('click', () => {
                app.appendChild(poneyForm(poneyDetail));
                const btn = document.querySelector('#envoyer')
                console.log(btn);
                btn.addEventListener('click', () => {
                    const test ={
                        'id' : 1,
                        'name' : 'testName',
                        'color' : 'testColor',
                        'age' : '24',
                    }
                    modifyData(test)
                })
                registerBtnBack()
            })
            registerBtnBack()
        })
    })

    return divPoney;
}


function poneyDetailHtml(poneyDetail)
{
    const divPoneyDetail = document.createElement('div');
    divPoneyDetail.innerHTML = `
    <div class='content'> 
        <h2>ID    : ${poneyDetail.id}, ${poneyDetail.name} </h2>
        <span>Age : ${poneyDetail.age}</span>
        <span>Age : ${poneyDetail.color}</span>
    </div>
    `;
    return divPoneyDetail;
}

function detailMenu() {
    const menu = document.createElement('div');
    menu.innerHTML = 
    `<div class='parent'>
        <div id='modify'>Modifier</div>
        <div id='back'>Retour</div>        
    </div>`;
    return menu;
}

// lorqu'on clique sur un ponney on revoit le detail de se dernier, on peut également modifie ici le ponney (pas encore fait)
function showDetail(divs)
{
    divs.forEach(div => {
        div.addEventListener('click' , ()=> {
            // on recup l'id du contenu pour genère le detail e l'url
            id = div.id
            const url =  urlId(id)
            reset(); 
            fetch(url)
            .then(function(reponse){
                return reponse.json();
            })
            .then(function(poneyDetail){
                console.log(poneyDetail);
                app.appendChild(poneyDetailHtml(poneyDetail));
                app.appendChild(detailMenu());
                // modifié les info du ponney
                const btnModify = document.querySelector('#modify')
                btnModify.addEventListener('click', () => {
                    app.appendChild(poneyForm(poneyDetail));
                    const btn = document.querySelector('#envoyer')
                    console.log(btn);
                    btn.addEventListener('click', () => {
                        test ={
                            'id' : 1,
                            'name' : 'testName',
                            'color' : 'testColor',
                            'age' : '24',
                        }
                        modifyData(test)
                    })
                    registerBtnBack()
                })
                registerBtnBack()
            })
        })
    });
}
// liste l'ensemble des ponneys
function initializationCall(url)
{
    fetch(url)
    .then(function(response) {
        return response.json();
    })
    .then(function(poneys){
        // boucle de tous les elements de l'api
        poneys.forEach(poney => {    
            const poneyEl = divPoney(poney)
            app.appendChild(poneyEl);
        });

        // <div id="app">
        //     <div class="content">
        //     <div>Name</div>
        //     ...
        //     </div>
        // </div>
          
    })
    .then(function(){
        let contents = document.querySelectorAll('.content')        
        showDetail(contents)
        // reset()
    })
}

function addJsonData(name,color,age)
{
    const postData = {
        name: name,
        color: color,
        age: age,
    };
    try {
        const response =  fetch('http://ludivinecrepin.fr/api/pony-add.php', {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
        });
        if (!response.ok) {
        const message = 'Error with Status Code: ' + response.status;
        throw new Error(message);
        }
        const data =  response.json();
    } catch (error) {
        console.log('Error: ' + error);
    }
}
function addData(){
    const name = document.querySelector('#name')
    const color = document.querySelector('#color')
    const age = document.querySelector('#age')
    addJsonData(name.value,color.value,age.value)
    
}

function modifyJsonData(id,name,color,age){
    const postData = {
        id: id,
        name: name,
        color: color,
        age: age,
    };
    try {
        const response =  fetch('http://ludivinecrepin.fr/api/pony-update.php', {
        method: "post",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(postData)
        });
        if (!response.ok) {
        const message = 'Error with Status Code: ' + response.status;
        throw new Error(message);
        }
        const data =  response.json();
    } catch (error) {
        console.log('Error: ' + error);
    }
}

function modifyData(element){
    console.log('id : '+element.id)
    console.log('name : '+element.name)
    console.log('color : '+element.color)
    console.log('age : '+element.age)
    modifyJsonData(element.id,element.name,element.color,element.age)   
}
// addJsonData('test','fakeD',42)
// modifyJsonData(1,'42','42','42');
// appel de la page de base au début

function poneyDetailHTMLMAEl(poneys) {
    return poneys.map(poney => `<div class='content'> 
        <h2>ID    : ${poneyDetail.id}, ${poneyDetail.name} </h2>
        <span>Age : ${poneyDetail.age}</span>
        <span>Age : ${poneyDetail.color}</span>
    </div>
    <div class='parent'>
        <div id='modify'>Modifier</div>
        <div id='back'>Retour</div>        
    </div>`)
}

home()
