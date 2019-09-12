(async () =>{

    const path = '/data/Film_Permits.csv';

    // Our CSV is available client side
    // By using the "fetch" command
    const data = await fetch(path)
                       .then((data,error) => {
                           if(data.status != 200){
                                throw error;
                           }
                           return data.text();
                        })
                        .catch( error => {
                            return false;
                        });
    // Below, I've defined a function that
    // returns the viz taking our CSV text
    // as input
    if(data){
        generateViz(data);
    } else {
        // Render an error message if an error
        // is generated in fetch call.
        addToDOM(`<b>Error</b><br/>Unable to load data from source provided.`);
    }
})();

function generateViz(data){
    // generate Object from CSV
    const csv  = csvToObject(data);

    // Create an empty object that will store
    // our total counts of objects
    let boroughCount = {};

    // Define empty variables
    // for our min and max years
    let minYear, maxYear;

    csv.forEach( entry => {
        // this helps clean up the Entered On field to 
        // extract the year from it
        let year = entry.EnteredOn.split(' ')[0].split('/')[2];

        if( !boroughCount[entry.Borough] ){
            boroughCount[entry.Borough] = 1;
        } else {
            boroughCount[entry.Borough] += 1;
        }

        // if our years are not defined,
        // then define it
        if     ( !minYear       ){ minYear = year }
        else if( !maxYear       ){ maxYear = year }
        // then, overwrite them if a new
        // max or new min is found
        else if( year > maxYear ){ maxYear = year; }
        else if( year < minYear ){ minYear = year; }

    });

    // Below, I've defined a function that helps append 
    // Template Literal Strings (https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Template_literals)
    // and takes a second parameter for a class name

    // This one describes our min and max years
    // and total count.
    addToDOM(`Between <b>${minYear}&ndash;${maxYear}</b>
    there were <b>${csv.length}</b> total film permits
    issued in New York City.`, 'header');

    Object.keys(boroughCount).forEach( (borough,index) => {
        let percent = boroughCount[borough]/csv.length * 150;
        addToDOM(`<b>${borough}</b>
        <span class="number">${boroughCount[borough]}</span>
        <span class="bar color-${index}"
              style="width:${percent}%;"></span>`, 'borough');
    });  
}

function csvToObject( data ){
    let headers = data.split('\n')[0]
                      .split(',');
    let rows    = data.split('\n')
                      .slice(1,-1)
                      .map(row => row.split(','));
    return rows.map(row => {
        let myObject = {};
        headers.forEach((elem, index)=>{    
           myObject[elem] = row[index];
        });
        return myObject;
    });
}

function addToDOM(string, className){
    if(!string){
        // this closes our function
        // if a string wasn't provided
        return false;
    }
    
    // create a div element to put
    // our content into
    let div = document.createElement('div');

    // if a class name was provided
    // then add that to the div
    if(className){
        div.classList.add(className);
    }
    
    // add content to div
    div.innerHTML = string;
    
    // append to our <div id="app">
    document.getElementById('app').appendChild(div);
}