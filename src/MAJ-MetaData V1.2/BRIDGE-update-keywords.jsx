//@target bridge;
//@include '../API/logFolder.jsx';
//@include '../API/toolbox.jsx';
//@include 'BRIDGE_Thumbnail-Extension.jsx';

// alert('ENTER THE BRIDGE', 5);

//Récupérer un objet par bridgetalk ? ou string
Thumbnail.prototype.references=[];
//~ var path='/Users/creation/Documents/DATA-PRODUITS/34000/34242/TEST.tif';
var theFile=new File(path);
var myThumb=new Thumbnail(theFile);
myThumb.references=refsString.split(',');
//Faire un script à part pour nettoyer les doublons, ça peut toujours servir de façon générale, et l'invoquer depuis ce script en fin d'append.

//========================Met à jour metadata du fichier========================
function main(){
    // alert('Enter BRIDGE MAIN', 5);
//-----------------initialisation de la mise à jour------------------ 
//See for reference guide to XMPScript http://estk.aenhancers.com/10%20-%20Scripting%20Access%20to%20XMP%20Metadata/xmpscript-object-reference.html
    if( xmpLib == undefined ) {
		if( Folder.fs == "Windows" ){
			var pathToLib = Folder.startup.fsName + "/AdobeXMPScript.dll";
		} 
		else {
			var pathToLib = Folder.startup.fsName + "/AdobeXMPScript.framework";
		};
	
		var libfile = new File( pathToLib );
		var xmpLib = new ExternalObject("lib:" + pathToLib );//$.writeln('xmpLib version = '+xmpLib.version);
    };

    app.synchronousMode=true;//$.writeln('SYNCHRONOUS MODE : '+app.synchronousMode);
//------------------------------------------------------     

//-------------------Met à jour fichier---------------
             //$.writeln(myThumb.spec.exists);
             //$.writeln(myThumb.spec instanceof File);             
         if(myThumb.spec.exists && myThumb.spec instanceof File){
             //$.writeln(myThumb.references);
             var isUpdated=myThumb.SetMD_Refs(); 
            // if(isUpdated){};
         };
//----------------------------------------------------------

    xmpLib.unload();
    
return 'over';
}
//================================================================================================

main();