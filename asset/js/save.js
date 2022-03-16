// varaible URL 
const urlGet ='http://ludivinecrepin.fr/api/pony-get.php'
let html =''
// fonctions


function addData(){
    const name = document.querySelector('#name')
    const color = document.querySelector('#color')
    const age = document.querySelector('#age')
    addJsonData(name.value,color.value,age.value)
    
}
// onClick='addData()
function poneyForm(poneyDetail ='')
{
    let title = 'Ajouter un ponney'
    if(poneyDetail!==''){
        title = `Modifier les information de ${poneyDetail.name}`
    }
    let html = ` 
    <h1>${title}</h1>  
    <form id='form'>
   
    <label for="name">Nom du poney : </label>
    <input type="text" id="name" name="name" value='maxou' placeholder='Ex : petitTonnaier'>

    <label for="color">Couleur du poney</label>
    <input type="text" id="color" name="color"  placeholder='Ex : noir'>

    <label for="age">Age du poney</label>
    <input type="number" id="age" name="number"  placeholder='Ex : 25'>
    <div class='parent'>
    <button type='button' ' id='envoyer'>envoyer</button>
    </div>
    
    </form>
    
    `
    return html
}

// reset de la div app
function reset(){
    document.body.innerHTML = `<div class='wrap' id="app"></div>`;    
    return document.querySelector('#app') 
}
// page d'accueil
async function home()
{   
    reset()
    initializationCall(urlGet)
    app.innerHTML = poneyForm()
    sendForm()

}
// appel la fonction home() lors d'un clik sur le bouton retour
function btnBack(){
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


function urlId(id)
{
    return 'http://ludivinecrepin.fr/api/pony-get-id.php/'+id
}

function poneyDetailHtml(poneyDetail)
{
return `
    <div class='content'> 
        <h2>ID    : ${poneyDetail.id}, ${poneyDetail.name} </h2>
        <span>Age : ${poneyDetail.age}</span>
        <span>Age : ${poneyDetail.color}</span>
    </div>
    <div class='parent'>
        <div id='modify'>Modifier</div>
        <div id='back'>Retour</div>        
    </div>
    
`
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
                app.innerHTML += poneyDetailHtml(poneyDetail)
                // modifié les info du ponney
                const btnModify = document.querySelector('#modify')
                btnModify.addEventListener('click', () => {
                    app.innerHTML += poneyForm(poneyDetail)
                    btnBack()
                })
                btnBack()
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
            html += `
            <div id='${poney.id}' class='content'>
                <div class='name'> Nom : ${poney.name}</div>
                <div class='color'>Couleur : ${poney.color}</div>
                <div class='age'> Age : ${poney.age}</div>
            </div>            
            `         
        })  
        app.innerHTML += html
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

// addJsonData('test','fake',42)

// appel de la page de base au début
home()