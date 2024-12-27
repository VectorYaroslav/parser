document.addEventListener("DOMContentLoaded", (e) => {

    arr_list = []
    arr_det = []

    end_pos = 0
    /********** Start loading urls **********/
    var main_url = document.getElementById("main_url")
    start = document.getElementById("start")
    start.onclick = function(){
        getUrls(main_url.innerText)
        this.remove()
    }
    /********** Start loading urls(END) **********/
    
    /********** Paste URL when document loaded **********/
    navigator.clipboard.readText()
    .then(text => {
        if(text.indexOf("http://") > -1 || text.indexOf("https://") > -1){
            main_url.innerHTML = text
            start.style.display = "block"
        }else{
            start.style.display = "none"
            main_url.innerHTML = ""
        }
    })
    /********** Paste URL when document loaded(END) **********/


    /********** Paste URL when document visible **********/
    document.addEventListener("visibilitychange", () => {
        if (document.visibilityState == "visible") {
            setTimeout(async () => {
                let text = await navigator.clipboard.readText();
                if(text.indexOf("http://") > -1 || text.indexOf("https://") > -1){
                    main_url.innerHTML = text
                    start.style.display = "block"
                }else{
                    start.style.display = "none"
                    main_url.innerHTML = ""
                }
            }, "10");
        }
    })
    /********** Paste URL when document visible(END) **********/


    /********** Get urls  **********/
    function getUrls(url){
        var xhr = new XMLHttpRequest()

        xhr.open('GET', url, true)
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4){
            //console.log(xhr.responseText)
            return
        } 

        if (xhr.status === 200){
            var resp = xhr.responseText
            var start_pos = resp.indexOf(arr_pos[0][0])
            start_pos = start_pos + arr_pos[0][1]
            end_pos = resp.indexOf(arr_pos[1][0])
            getNameAndDetUrl(resp, start_pos)

            //console.log(xhr.responseText);
        }else{
            //console.log(xhr.responseText)
        }

        };
        xhr.send(null);
    }
    /********** Get urls(END) **********/

    function getNameAndDetUrl(resp, pos){
        var name_start_pos = resp.indexOf(arr_pos[2][0], pos)
        if(name_start_pos == -1 || name_start_pos > end_pos){console.log(arr_list); getPicture(arr_list); return false}

        name_start_pos = name_start_pos + arr_pos[2][1]
        var name_end_pos = resp.indexOf(arr_pos[2][2], name_start_pos)
        if(name_end_pos == -1 || name_end_pos > end_pos){console.log(arr_list); getPicture(arr_list); return false}

        var name = resp.substring(name_start_pos, name_end_pos)
        
        var url_start_pos = resp.indexOf(arr_pos[3][0], name_end_pos)
        if(url_start_pos == -1 || url_start_pos > end_pos){console.log(arr_list); getPicture(arr_list); return false}

        url_start_pos = url_start_pos + arr_pos[3][1]
        var url_end_pos = resp.indexOf(arr_pos[3][2], url_start_pos)
        if(url_end_pos == -1 || url_end_pos > end_pos){console.log(arr_list); getPicture(arr_list); return false}

        var url = resp.substring(url_start_pos, url_end_pos)

        arr_list.push([name, url])

        getNameAndDetUrl(resp, url_end_pos)

    }
    //count = 3
    /********** Get picture  **********/
    function getPicture(arr){

        var xhr = new XMLHttpRequest()
        xhr.open('GET', arr[0][1], true)
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4){
            //console.log(xhr.responseText)
            return
        } 

        if (xhr.status === 200){

            var resp = xhr.responseText
            var pic_start_pos = resp.indexOf(arr_det_pos[0][0])

            pic_start_pos = pic_start_pos + arr_det_pos[0][1]

            var pic_end_pos = resp.indexOf(arr_det_pos[0][2], pic_start_pos)
            pic_end_pos = pic_end_pos + arr_det_pos[0][3]

            var picture = resp.substring(pic_start_pos, pic_end_pos)

            console.log(picture)
            arr_det.push([picture, arr[0][0]])
            arr.shift();

            //count = count -  1
            if(
                arr.length > 0 
                //&& count > 0
            ){
                getPicture(arr)
            }else{
                console.log("All pictures loaded")
                main_url.innerHTML = ""
                showPictures(arr_det)
            }
        }else{
            //console.log(xhr.responseText)
        }

        };
        xhr.send(null);
    }
    /********** Get picture(END) **********/

    selected_pictures = []
    /********** Save pictures  **********/
    function showPictures(arr){
        select_pictures = document.getElementById("select_pictures")
        arr.forEach(element => {
            var tr = document.createElement("tr")
            var td = document.createElement("td")
            var pic = document.createElement("img")
            pic.src = element[0]

            var name = document.createElement("div")
            name.classList.add("name")
            name.innerHTML = element[1]
            name.onclick = function(){
                if(this.classList.contains("selected")){
                    this.classList.remove("selected")
                    var index = selected_pictures.indexOf(this.innerText);
                    if (index !== -1) {
                        selected_pictures.splice(index, 1);
                        console.log(selected_pictures)
                    }
                }
                else{
                    this.classList.add("selected")
                    selected_pictures.push(this.innerText)
                    console.log(selected_pictures)
                }
            };

            td.append(pic)
            td.append(name)
            tr.append(td)
            select_pictures.append(tr)
        })
    }
    /********** Save pictures(END) **********/
})