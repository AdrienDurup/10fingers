//Toolbox functions 
//var test=['01234','23456','khugkjhg','','kjlkjh','45678','01234','01234'];
 Array.prototype.strictFilter=function(arg){
          var tempArr=new Array;
          if(arg instanceof RegExp){
                           for (var y=0;y<this.length;y++){
                                if(arg.test(this[y])){
                                    tempArr.push(this[y]);
                                 };
                           };
              }else{
                       for (var y=0;y<this.length;y++){
                           if(this[y]==arg){
                                tempArr.push(this[y]);
                                };
                           };
                        };
   return tempArr;
   }

 Array.prototype.filter=function(arg){
          var tempArr=new Array;
          if(typeof arg=='string'||arg instanceof RegExp){
              var tmpRE=arg;
              }
          else{
              $.writeln('\.filter() supports String or RegExp argument only\.');
               return false;   
                  };
          
               for (var y=0;y<this.length;y++){
                     if(this[y].match(tmpRE)){
                            tempArr.push(this[y]);
                            };
                     };
              return tempArr;
    }
//TEST OF FILTER
//~ var test=['azefzef01234zefzfe','fzefzef23456','khugkjhg','','kjlkjh','45678','01234zefzef','01234'];
//~ var st='01234';
//~ var print=test.filter(st);$.writeln(print);
//~ var rx=new RegExp(/\d{5}/);
//~ print=test.filter(rx);$.writeln(print);

 Array.prototype.uniqueVal=function(){
     var tmpArr=[this[0]];   
        try{
            var uv3;
         for(var uv=1;uv<this.length;uv++){
             uv3=true;
             for(var uv2=0;uv2<tmpArr.length;uv2++){
                 if(this[uv]==tmpArr[uv2]){
                     uv2=tmpArr.length;
                     uv3=false;
                     };
                 };
                 if(uv3){tmpArr.push(this[uv]);};
                };

         return tmpArr;
         }
        catch(error){$.writeln('uniqueVal() method failed : '+error);};

     }
 //~  var test=['1324','2345','4567','1234','1324','2345','4567','1234'];
//~  var print=test.uniqueVal();$.writeln(print);

  Array.prototype.uniqueByRegex=function(aRegex){
 if(!(aRegex instanceof RegExp)){$.writeln('Error : argument not a RegExp object');return false;};
        try{
            
            var uv3 ; var testThis ; var match1=[] ; var match2=[] ; var tmpArr=[]; 
            
         for(var uv=0;uv<this.length;uv++){
             
           if(typeof this[uv]!='string'){$.writeln('Error : Array value is not of type "string"');return false;};
           
           testThis=aRegex.test(this[uv]) ;$.writeln(this[uv]);//TEST : est ce que lentrée du tableau correspond à l'expression régulière ?
           if(testThis){match1=this[uv].match(aRegex);uv3=true;}else{match1=[];uv3=false;};//Si oui, récupérer la string dans match1, sinon, réinitialiser match1. uv3=false doit être avant la boucle for qui ne s'execute pas tant que tmpArr.length==0
 
        for(var uv2=0;uv2<tmpArr.length;uv2++){//iterate through new array, looking for equality
                  if(!uv3){break;};//si une entrée du tableau testé n'est pas conforme, break la recherche d'égalité.
                 match2=tmpArr[uv2].match(aRegex);
                 //if(match2=== null){match2=[];}; //CETTE LIGNE DEVRAIT ETRE INUTILE (puisque match2 devrait toujours matcher la regex) LA GARDER POUR LES TESTS ET DEBUGGAGE
                 var  testThis2 = (match1[0]==match2[0]);//$.writeln(testThis2);
                 //$.writeln('testThis2 = '+testThis+' /// '+'match1 = '+match1+' ET match2 = '+match2);
                 if(testThis2){
                     uv2=tmpArr.length;
                     uv3=false;//$.writeln('UV3 = '+uv3);
                     };
                 };
                 if(uv3){tmpArr.push(this[uv]);
                     //$.writeln('PUSH = '+this[uv]);$.writeln(match1+' différent de '+match2);$.writeln();
                     };
                };

         return tmpArr;
         }
        catch(error){$.writeln('uniqueByRegex() method failed : '+error);};

     }
//~  var test=['incroyable','non1234non','uuuuu','4567','1234','faux1824','123','1236non','non1234faux'];
//~  var reg=new RegExp(/\d{4}/);
//~  var print=test.uniqueByRegex(reg);$.writeln(print);
 
 
 File.prototype.shortName=function(){
    var tmp=this.name.split('\.');
tmp.pop();tmp.join('\.');
return tmp.toString();
    }

function delExt(file){
    try{
 var tmp=file.name;
var tmp=tmp.split('\.');
tmp.pop();tmp.join('\.');
return tmp;}
catch(error){$.writeln(error);};
    }

function keepOldModifyDate(oDate,oFile){//A TESTER
if (!oFile instanceof File || !oFile.exists) return false;
    if (File.fs == "Windows")  {
        alert('Can\'t keep ModifyDate on Windows system');
return false;
    }
    else if (File.fs == "Macintosh") {
        var myAppleScript = 
        'tell application "Finder"\r' +
        'set modificationDate to '+oDate+' of '+oFile.fsName+'\r' +
        'end tell\r'
        app.doScript(myAppleScript, ScriptLanguage.applescriptLanguage);
    };
   }
function sortUp(a,b){return a-b;}
function sortDown(a,b){return b-a;}
function WriteLogLn(logFolder,logName,string){
    if(!logFolder.exists) {logFolder.create()};
    var logFile=new File(logFolder+'\/'+logName);
    if(!logFile.exists) {
        logFile.open('w');
        }else{logFile.open('a');};
    //$.writeln(appendString);
    logFile.writeln(string);           
    logFile.close();
    }
function WriteLog(logFolder,logName,aString){
    if(!logFolder.exists) {logFolder.create()};
    var logFile=new File(logFolder+'\/'+logName);
     //if(logFile.exists){$.writeln('logFile.exists = '+logFile.exists);};   
    if(!logFile.exists) {
        logFile.open('w');
        }else{logFile.open('a');};
    var hasWritten=logFile.write(aString);  
    if(hasWritten){$.writeln('Written : '+hasWritten+'\n======================');}else{$.writeln('Failed to append log file.\n======================');};
    logFile.close();
    }
function escapeRegExp(text) {
  return text.replace(/[-[\]{}()*+?.,\\\/^$|#\s]/g, '\\$&');
}
 var flashboxwin;var flashboxfield;
 function flashBox(str,time){
     if(flashboxwin==undefined){
//~          alert('new flashbox');
            flashboxwin=new Window('palette','flashbox');
            flashboxfield=flashboxwin.add('statictext',[0,0,150,150],undefined);
        }
    flashboxfield.text=str;
    flashboxwin.show();
$.sleep(time);
flashboxwin.hide();
 }
function launch(aPath){
var fileToLaunch=new File(aPath);
if(fileToLaunch.exists){
    try{
          $.evalFile(fileToLaunch);  
    }catch(e){alert('Erreur dans le fichier '+fileToLaunch.name+' : '+e);};
}else{
    alert('Script introuvable : '+fileToLaunch.name);
    };
return true;
}
function debugln(string,lvlString){
try{
var debugln=debug[lvlString]?$.writeln(string):false;
//  var debugln=debug[lvlString]?alert(string):false;
}catch(e){$.writeln(e);};
}

$.setTimeout = function(func, time) {
     if(typeof func=='function'){
    var res=func();
    };
    for(var i=0;i<time;i++){
        if(res!='undefined'){i=time;};
        $.sleep(1*time);        
        };

};