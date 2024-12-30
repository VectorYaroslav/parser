document.addEventListener("DOMContentLoaded", (e) => {

    arr_list = []                                                               // Array for elements listing data 
    arr_det = []                                                                // Array for element detail data 

    end_p = 0                                                                 // End position
    /********** Start loading urls **********/
    var main_url = document.getElementById("main_url")
    start = document.getElementById("start")
    start.onclick = function(){
        getList(main_url.innerText)
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


    /********** Get list of elements **********/
    function getList(main_url){
        var xhr = new XMLHttpRequest()

        xhr.open('GET', main_url, true)
        xhr.setRequestHeader('Content-Type','application/x-www-form-urlencoded; charset=UTF-8');
        xhr.onreadystatechange = (e) => {
        if (xhr.readyState !== 4){
            //console.log(xhr.responseText)
            return
        } 

        if (xhr.status === 200){
            var resp = xhr.responseText
            var start_p = resp.indexOf(start_pos[0])                     
            start_p = start_p + start_pos[1]                           // Set start position
            end_p = resp.indexOf(end_pos[0])                           // Set end position
            getElementsListData(resp, start_p)                          // Start getting listing data

            //console.log(xhr.responseText);
        }else{
            //console.log(xhr.responseText)
        }

        };
        xhr.send(null);
    }
    /********** Get list of elements(END) **********/

    function getElementsListData(resp, pos){
        
        var data1_start_pos = resp.indexOf(arr_list_pos[0][0], pos)
        if(data1_start_pos == -1 || data1_start_pos > end_p){console.log(arr_list); getDetailData(arr_list); return false}

        data1_start_pos = data1_start_pos + arr_list_pos[0][1]
        var data1_end_pos = resp.indexOf(arr_list_pos[0][2], data1_start_pos)
        if(data1_end_pos == -1 || data1_end_pos > end_p){console.log(arr_list); getDetailData(arr_list); return false}

        var data1 = resp.substring(data1_start_pos, data1_end_pos)
        
        var data2_start_pos = resp.indexOf(arr_list_pos[1][0], data1_end_pos)
        if(data2_start_pos == -1 || data2_start_pos > end_p){console.log(arr_list); getDetailData(arr_list); return false}

        data2_start_pos = data2_start_pos + arr_list_pos[1][1]
        var data2_end_pos = resp.indexOf(arr_list_pos[1][2], data2_start_pos)
        if(data2_end_pos == -1 || data2_end_pos > end_p){console.log(arr_list); getDetailData(arr_list); return false}

        var data2 = resp.substring(data2_start_pos, data2_end_pos)

        arr_list.push([data1, data2])

        getElementsListData(resp, data2_end_pos)

    }
    //count = 3                                                                 // Test
    /********** Get detail data  **********/
    function getDetailData(arr){
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
            var det_start_pos = resp.indexOf(arr_det_pos[0][0])

            det_start_pos = det_start_pos + arr_det_pos[0][1]

            var det_end_pos = resp.indexOf(arr_det_pos[0][2], det_start_pos)
            det_end_pos = det_end_pos + arr_det_pos[0][3]

            var detail_data = resp.substring(det_start_pos, det_end_pos)

            console.log(detail_data)
            arr_det.push([detail_data, arr[0][0]])
            arr.shift();
            console.log("Elements left: "+arr.length)
            //count = count -  1                                                // Test
            if(
                arr.length > 0 
                //&& count > 0                                                  // Test
            ){
                getDetailData(arr)
            }else{
                //console.log("All data loaded")
                main_url.innerHTML = ""
                showPictures(arr_det)
            }
        }else{
            //console.log(xhr.responseText)
        }

        };
        xhr.send(null);
    }
    /********** Get detail data(END) **********/


    selected_pictures = []
    select_items = document.getElementById("select_items")
    show_selected = document.getElementById("show_selected")
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
                        selected_pictures.splice(index, 1)
                        if(selected_pictures.length == 0) show_selected.style.display = "none"
                        //console.log(selected_pictures)
                    }
                }
                else{
                    this.classList.add("selected")
                    selected_pictures.push(this.innerText)
                    show_selected.style.display = "block"
                    //console.log(selected_pictures)
                }
            }

            td.append(pic)
            td.append(name)
            tr.append(td)
            select_items.append(tr)
        })
    }
    /********** Save pictures(END) **********/

    /********** Show selected **********/
    copy_selected = document.getElementById("copy_selected")
    show_selected.onclick = function(){
        copy_selected.style.display = "block"
        copy_selected.innerText = ''
        selected_pictures.forEach(element =>{
            copy_selected.value += element+","
        })
    }

    /********** Show selected(END) **********/

})