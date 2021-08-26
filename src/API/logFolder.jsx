//~ var logFolder=new Folder('\~\/Documents\/DATA-PRODUITS\/LOGS');//MAC
var logFolder=new Folder('\~\/Documents\/DATA-PRODUITS\/LOGS\/');//MAC
//TRANSFORMER VAR EN CONST QUAND CE SERA OK
//~ if(typeof USER_OS==='undefined'){
var USER_OS=$.os.toLowerCase().indexOf('mac') >= 0 ? "MAC": "WINDOWS";
var USER_UserName=$.getenv('USER');  
// var USER_Root='Volumes/';
function hasDesktop(){
    var  desktopPart='/Users/'+USER_UserName+'/Desktop/Documents';
  var hasDesktop_Folder=new Folder(desktopPart);
  if(hasDesktop_Folder.exists){
return '/Desktop';
  }else{return '';};
}

var USER_Desktop=hasDesktop();
var USER_AdobeScriptFolder='/Users/'+USER_UserName+USER_Desktop+'/Documents/Adobe Scripts';  
var USER_AdobeLogFolder='/Users/'+USER_UserName+USER_Desktop+'/Documents/LOGS';  
//~ var USER_AdobeScriptFolder_obj=new Folder(USER_AdobeScriptFolder);

//~ const USER_OS=$.os.toLowerCase().indexOf('mac') >= 0 ? "MAC": "WINDOWS";
//~ const USER_UserName=$.getenv('USER');  
//~ const USER_AdobeScriptFolder='/'+USER_UserName+'/Documents/Adobe Scripts';  
   
//~ };
//~         $.writeln(USER_OS);
//~         $.writeln(USER_UserName);
//~         $.writeln(USER_AdobeScriptFolder);        
//~         $.writeln(prout.name);      
//var logFolder=new Folder('Macintosh HD\/Users\/creation\/Documents\/DATA-PRODUITS\/LOGS\/');//MAC OLD VERSION
//var logFolder=new Folder('\/Users\/Elise\/Documents\/Adobe Scripts\/bridge\/');//PC //Utilisateur chez moi