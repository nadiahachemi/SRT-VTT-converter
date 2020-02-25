$(".radio").click(function(){
    $(".radio").toggleClass('active')
})


$("#getIt").click(function(){
    if($("input")[0].files.length>0){
        $('.loader').addClass('show')
        setTimeout(function ()  {
            if($('.radio.vtt').hasClass('active')){
                buildVtt($("input")[0].files);
            }else if($('.radio.srt').hasClass('active')){
                buildSrt($("input")[0].files);
            }
        }, 500);
    }
})


// srt to vtt
function buildVtt(files) {
    //Read all files
    for (var i = 0; i < files.length; i++) (function (file) {
        // Create reader
        var name = files[i].name.replace('.srt', '.vtt');
        console.log(files[i].name)
        var reader = new FileReader();
        
        // Event file loaded
        reader.addEventListener('load', function () {

            // init file with WEBVTT
            var file = "WEBVTT\r\n\r\n";
            
            // split lines
            var lines = reader.result.split(/^\d+(\r\n|\n|\r)/gm);

            // remove empty lines
            lines.map(function(line){ if (line == /^(\r\n|\n|\r)^/gm){return line =  ""}});

            //replace commas by dots
            lines.map(function(liner){ 
                var list = liner.split(/(\r\n|\n|\r)/gm)
                for( var i in list){ 
                    if(list[i].length > 5 && list[i].indexOf("-->") >-1){
                      list[i] = list[i].replace(',', '.');
                      list[i] = list[i].replace(',', '.');
                    }
                }
                liner = list.join('');
                liner+="#";

                // push each lines in file
                file+= liner
            });

            //remove double breaks
            file = file.split("#").filter(function(e){return e.length>5 && e!= /(\r\n|\n|\r)/gm}).join("");

            // save file
            saveAs(new Blob([file], {type:'application/octet-stream'}), name);

        }, false,  $('.loader').removeClass('show'));

        // Read file
        reader.readAsText(file);

    })(files[i]);
}

// vtt to srt
function buildSrt(files) {
  
    //Read all files
    for (var i = 0; i < files.length; i++) (function (file) {
        // Create reader
        var name = files[i].name.replace('.vtt', '.srt')
        var reader = new FileReader();
        
        // Event file loaded
        reader.addEventListener('load', function () {

            // init file with WEBVTT
            var file = "";
            
            // split lines
            var lines = reader.result.replace('WEBVTT', '').split(/^(\r\n\n|\r)/gm).filter(function(e){return e.length>2 && e!= /(\r\n|\n|\r)/gm});



    lines.map(function(line, ind){
        var list = line.split(/(\r\n|\n|\r)/gm)
        for( var i in list){ 
            if(list[i].length > 5 && list[i].indexOf("-->") >-1){
              list[i] = list[i].replace('.', ',');
              list[i] = list[i].replace('.', ',');
            }
        }
        line = "\n\r" + ind++ + list.join('') ;
        // push each lines in file
        file+= line
    })   
    file = file.split(/^(\r\n\n|\r)/gm).filter(function(e){return e.length>5 && e!= /(\r\n|\n|\r)/gm}).join("");

            // // save file
            saveAs(new Blob([file], {type:'application/octet-stream'}), name);

        }, false,  $('.loader').removeClass('show'));

        // Read file
        reader.readAsText(file);

    })(files[i]);

}

