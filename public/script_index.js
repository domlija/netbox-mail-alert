

async function get_devices(){
    let email_site = document.getElementById("email-show").value
    //console.log(email_site)
    let data_raw = await fetch('/show', {
        method: 'POST',
        headers: {
            'Accept': 'application/json, text/plain, */*',
            'Content-Type': 'application/json'
          },
        body: JSON.stringify({email:email_site})
    }) 
    //console.log(data_raw.json())
    let content =  await data_raw.json();
    console.log(content)
    let email_list = JSON.parse(content)
    let list_dom = document.getElementById("list")
    let list_el_dom = document.getElementById("helper-div")

    while (list_dom.firstChild) {
        list_dom.removeChild(list_dom.firstChild);
    }

    console.log(email_list)
    email_list.forEach(element => {
        let h = list_el_dom.cloneNode(false);
        h.style.display = "block"
        h.textContent = element
        list_dom.appendChild(h);
    });
}
