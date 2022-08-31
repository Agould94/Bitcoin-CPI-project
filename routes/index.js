//import $ from "jquery";
const endpoint = "latest"

const apiKey = "9715ry6j0d17layhlwnbm0xh017a2j3c2ayn9rxu6y6i50fpoo2699ntaf89"
let jsonArr = []
//add get symbol information on hover.

    function getlatestApi(){
        const APIdata = fetch("https://www.commodities-api.com/api/latest?access_key=9715ry6j0d17layhlwnbm0xh017a2j3c2ayn9rxu6y6i50fpoo2699ntaf89&symbols=BTC,COFFEE,ETH,CORN,LUMBER,USD,WHEAT",{
            headers:{
                'If-None-Match': "7265705b413e79ed2b073d77bba450fe",
                'If-Modified-Since':"Tue, 12 Apr 2022 19:29:30 GMT"
            }
        })
            .then(function(response){
            return response.json();
        })  
        .then(function(data){
            //getJsonData()
            console.log(data.data.rates);
            let dataArr = []
            window.bitcoin = 1/data.data.rates.BTC
            console.log(window.bitcoin)
            Object.entries(data.data.rates).forEach(entry=>{
                console.log(entry)
                let dataObj = {}
                dataObj["name"]= entry[0]
                dataObj["price"]=1/entry[1]
                dataObj["BTCprice"]=1/entry[1]/bitcoin
                dataArr.push(dataObj)
            })
            
            //getJsonData()
            const fullArr = dataArr.concat(jsonArr)
            return fullArr
            
        })
        .then(function(data){
            console.log(data)
            //console.log(APIdata)
            //console.log(data.data)
            //renderPrices(data.data.rates)
            createTable(data)
            addItemstoTable(data)
            //populateTable(data.data.rates)
            //calculateData(data.data.rates)
            addForm(data)
            //getJsonData()
            //console.log(document.querySelector("table").querySelectorAll('tr'))
            handleRowDragging();
            //moveRow(data.data.rates)
            }) 
    }

    function handleRowDragging(){
        const table = document.querySelector("table")
        //console.log(table)
        let draggingEle; //dragging element
        let draggingRowIndex; //index of the dragging row
        let placeholder;
        let list; 
        let isDraggingStarted = false; 

        let x = 0;
        let y = 0;
        
        const swap = function(nodeA, nodeB){
            const parentA = nodeA.parentNode;
            const siblingA = nodeA.nextSiblng === nodeB ? nodeA : nodeA.nextSibling;
            nodeB.parentNode.insertBefore(nodeA, nodeB)
            parentA.insertBefore(nodeB, siblingA)
        };

        const isAbove = function(nodeA, nodeB){
            const rectA = nodeA.getBoundingClientRect();
            const rectB = nodeB.getBoundingClientRect()

            return rectA.top+rectA.height/2 < rectB.top+rectB.height/2;
        };

        const cloneTable = ()=>{
            const rect = table.getBoundingClientRect()
            const width = parseInt(window.getComputedStyle(table).width)
            list = document.createElement('div')
            list.style.position = 'absolute'
            list.style.left = `${rect.left}px`
            list.style.top = `${rect.top}px`
            table.parentNode.insertBefore(list, table)

            table.style.visibility = 'hidden'

            table.querySelectorAll('tr').forEach(function(row){
                const item = document.createElement('div');
                item.classList.add("draggable");
                

                const newTable = document.createElement('table');
                newTable.setAttribute('class', 'clone-table');
                newTable.style.width = `${width}px`

                const newRow = document.createElement('tr');
                //query the cells of the row
                const cells = [].slice.call(row.children);
                    cells.forEach(function(cell){
                        newCell = cell.cloneNode(true);
                        //set same width as original cell
                        newCell.style.width = `${parseInt(window.getComputedStyle(cell).width)}px`
                        newRow.appendChild(newCell);
                    });
                newTable.appendChild(newRow);
                item.appendChild(newTable);
                list.appendChild(item);
            });
        };

        const mouseDownHandler = (e) =>{
            //console.log(e)
            const originalRow = e.target.parentNode;
            draggingRowIndex = [].slice.call(table.querySelectorAll('tr')).indexOf(originalRow)

            x = e.clientX
            y = e.clientY

            document.addEventListener("mousemove", mouseMoveHandler);
            document.addEventListener("mouseup", mouseUpHandler)
        }

        
        const mouseMoveHandler = (e)=>{
            if (!isDraggingStarted){
                isDraggingStarted = true;
                cloneTable();
                draggingEle = [].slice.call(list.children)[draggingRowIndex];
                draggingEle.classList.add('dragging');

                placeholder = document.createElement('div')
                placeholder.classList.add('placeholder')
                draggingEle.parentNode.insertBefore(placeholder, draggingEle.nextSibling);
                placeholder.style.height = `${draggingEle.offsetHeight}px`
            }
            //set position for dragging element.
            draggingEle.style.position = 'absolute'
            draggingEle.style.top = `${draggingEle.offsetTop+e.clientY-y}px`
            draggingEle.style.left = `${draggingEle.offsetLeft +e.clientX - x}px`

            //reassign position of muouse
            x = e.clientX;
            y = e.clientY;

            //current order
            //prev ele
            //draggingele
            //placeholder
            //nextEle
            const prevEle = draggingEle.previousElementSibling;
            const nextEle = placeholder.nextElementSibling;

            //dragging element is above the previous element
            //user moves the dragging element to the top
            //dont allow to drop above header
            //which doest have previous element sibling

            if (prevEle && prevEle.previousElementSibling && isAbove(draggingEle, prevEle)){
                // current order -> the new order
                //prevEle        -> placeholder
                //draggingEle    -> draggingEle
                //placeHolder    -> prevEle
                swap(placeholder, draggingEle);
                swap(placeholder, prevEle);
                return;
            }

            //the draggingEle is below the next element
            //user moves the dragging element to the bottom. 

            if (nextEle && isAbove(nextEle, draggingEle)){
                //the current oder  -> the new order
                //draggingEle       -> nextEle
                //placeholder       ->placeholder
                //nextEle           ->draggingEle
                swap(nextEle, placeholder);
                swap(nextEle, draggingEle);
            }
        };

        const mouseUpHandler = (e)=>{
            placeholder && placeholder.parentNode.removeChild(placeholder);
            
            draggingEle.classList.remove('dragging')
            draggingEle.style.removeProperty('top')
            draggingEle.style.removeProperty('left')
            draggingEle.style.removeProperty('position')


            const endRowIndex = [].slice.call(list.children).indexOf(draggingEle)

            isDraggingStarted = false
            list.parentNode.removeChild(list)

            let rows = [].slice.call(table.querySelectorAll('tr'));
            draggingRowIndex > endRowIndex
            //user drops to the top
            ?rows[endRowIndex].parentNode.insertBefore(rows[draggingRowIndex], rows[endRowIndex])
            :rows[endRowIndex].parentNode.insertBefore(
                rows[draggingRowIndex], 
                rows[endRowIndex].nextSibling
                );
            table.style.removeProperty('visibility')

            document.removeEventListener("mousemove", mouseMoveHandler)
            document.removeEventListener("mouseup", mouseUpHandler)
        };

        
        //const table = document.querySelector(table)
        table.querySelectorAll('tr').forEach(function(row, index){
            if (index===0){
                return;
            }
            const firstCell = row.firstElementChild
            // console.log(row)
            // console.log(firstCell)
            // console.log(table)
            // console.log(document.getElementsByClassName('tableRow'))
            firstCell.classList.add("draggable");
            //console.log(firstCell.classList)
            firstCell.addEventListener("mousedown", mouseDownHandler)
        });
    }
    
    // function getSymbolsApi(){
    //     fetch("https://www.commodities-api.com/api/symbols?access_key=9715ry6j0d17layhlwnbm0xh017a2j3c2ayn9rxu6y6i50fpoo2699ntaf89")
    //         .then(function(response){
    //         return response.json()
    //     })
    //         .then(function(data){
    //             return createHoverEvent(data)
    //         })
    // }

    function createTable(data){
        const main = document.querySelector("main")
        const table = document.createElement("table")
        const tr = document.createElement("tr")
        const head = table.appendChild(tr)
        head.innerHTML="<th>Item</th><th>BTC</th><th>USD</th>"
        // Object.keys(data).forEach(key=>{
        //     const th = document.createElement("th") 
        //     th.id = key
        //     th.className = "xAxis"
        //     th.innerHTML=key
        //     head.appendChild(th)
        // })
        //head.innerHTML = "<th>Name</th>"
        main.appendChild(table)
    }
    function addItemstoTable(data){
        console.log(data)
        //data.forEach(i => console.log(i))
        const table = document.querySelector("table")
        //console.log(table)
             data.forEach(i => {
                 console.log(i.name)
                 const tr = document.createElement('tr')
                 tr.className = "tableRow"
                 const row = table.appendChild(tr)
                 row.id = `${i.name}y`
                 console.log(i.price)
                 console.log(i.id)
                 if(i.id!=undefined){
                    row.innerHTML = `<td>${i.name}</td><td>${i.BTCprice}</td><td>${i.price}<br><button type="button" class="update" id=${i.id}>Update</button></td>`
                 }else{
                    row.innerHTML=`<td>${i.name}</td><td>${i.BTCprice}</td><td>${i.price}</td>`
                }
             })
        clickHandler()
        // const b = table.getElementsByClassName("update")
        // console.log(b)
        // for(var i = 0; i < b.length; i++){
        //     b[i].addEventListener("click", popUpForm)
        // }
     }
    function popUpForm(){
        //console.log(id)
        console.log(this.id)
        updateItem(this.id)
        //form.setAttribute()
    } 
    function populateTable(data){
        console.log(data)
        const table = document.querySelector("table")
        //const bitcoin = 1/data[BTC]
        let dataObj = {}
        //console.log(bitcoin)
        Object.entries(data).forEach(entry=>{
            dataObj["name"]= entry[0]
            dataObj["price"]=1/entry[1]
            dataObj["BTCprice"]=1/entry[1]/window.bitcoin
            console.log(dataObj)
            const tr = document.createElement("tr");
            tr.className="tableRow"
            const row = table.appendChild(tr)
            row.id = `${entry[0]}y`
            row.innerHTML = `<td>${entry[0]}</td><td>${(1/entry[1])/bitcoin}</td><td>${1/entry[1]}</td>`
            //console.log(entry)
        })
    }
    
    function calculateData(data){
        const table = document.querySelector("table")
        const xAxis = table.getElementsByClassName("xAxis")
        const yAxis = table.getElementsByClassName("yAxis")
        
        
        for(let entry of xAxis){
            let x = entry.innerHTML
            let xPrice = data[x]
            //console.log(1/data[x])
            for(let e of yAxis){
                let y = e.innerHTML
                let yPrice = data[y]
                const tr = document.getElementById(`${y}y`)
                let td = document.createElement("td")
                let tableData = tr.appendChild(td)
                tableData.innerHTML = `${(yPrice/xPrice)}`
                //console.log(1/data[y])
            }
        }
    }

    function renderPrices(prices){
        const main = document.querySelector("main");
        console.log(prices)
        Object.entries(prices).forEach(entry=>{
           const h2 = document.createElement("h2")
           h2.innerHTML = `${entry[0]}, ${entry[1]}`
           main.appendChild(h2)
        })
    }

    function clickHandler(){
        const buttons = document.getElementsByClassName("update")
        const form = '<form class = "popupform" id="popupForm">'+
        '<label for="price">Updated Price</label>'+
        '<input type = "float" id = "price" name = "price">'+
        '</form>';
        for (let button of buttons){
            const popup = document.createElement("div")
            popup.innerHTML = (form)
            popup.style.display = "none"
            button.appendChild(popup)

            button.addEventListener("click", function(){
                popup.style.display = "block"
            })

        }
    }

    function createHoverEvent(data){
        const nameCells = document.getElementsByClassName("yAxis")
        for (let cell of nameCells){
            const s = cell.innerHTML.toString()
            const popup = document.createElement("div")
            popup.innerHTML = (data[s])
            //console.log(data)
            //popup.id = "popup"
            popup.style.display ="none"
            cell.appendChild(popup)
            
            cell.addEventListener("mouseover", function(){
                popup.style.display = "block"
            } )
            cell.addEventListener("mouseout", function(){
                popup.style.display = "none"
            })
        }
    }

    //const findSymbol = (data, s) => {
        
   // }
   function addForm(data){
        const form = document.querySelector("form")
        form.addEventListener("submit", handleSubmit)
        console.log(data)
        //const bitcoin = data[BTC].price
        console.log(window.bitcoin)
        function handleSubmit(e){
            e.preventDefault()
            console.log(e)
            let itemObj = {
                name: e.target.name.value,
                price: [parseInt(e.target.price.value)],
                BTCprice: e.target.price.value/window.bitcoin
            }
            addItem(itemObj)
        }

        function addItem(itemObj){
           //console.log(JSON.parse(itemObj))
               fetch("http://localhost:3000/Items",{
                   method: 'POST',
                   headers:{
                       'Content-type':'application/json'
                   },
                   body: JSON.stringify(itemObj)
               })
               .then(res=> res.json())
               .then(item => console.log(item))
        }


    }

    function updateItem(itemId){
        console.log(JSON.parse(itemId))
        fetch(`http://localhost:3000/items/${itemId}`,{
            method: 'PATCH',
            headers:{
                'Content-type':'application/json'
            },
            //body: JSON.stringify()
        })
        .then(res=>res.json)
        .then(item=>console.log(item))
    }

    function getJsonData(){
        
            fetch("http://localhost:3000/Items")
            .then(res=>res.json())
            .then(function(data){
                
                console.log(data)
            data.forEach(item => {
                item.price = item.price.reduce((a, b)=>a+b)/item.price.length
                jsonArr.push(item)}
            ) //addItemstoTable(data)
            //console.log(jsonArr)
            })
    } 
   

    // function createRow(i){
    //     const table = document.querySelector("table")
    //     const tr = document.createElement("tr")
    //     const row = table.appendChild(tr)
    //     tr.className = "tableRow"
    //     row.id = `${i.name}y`
    //     row.innerHTML = `<td>${i.name}</td><td>${i.BTCprice}</td><td>${i.price}</td>`
    // }

document.addEventListener('DOMContentLoaded', function(){
    //getSymbolsApi();
    //handleRowMovement();
    getJsonData()
    getlatestApi();
    //getJsonData()
    //addForm()
 

});

