//V1.1
//@target 'indesign';
//@target 'indesign';
//@targetengine 'DBHandling';
//@include 'MAJMetaData-objects.jsx';
//@include '../API/logFolder.jsx';
//@include '../API/toolbox.jsx';

var logFileName='MAJ-data-temp\.txt';
var this$=new File($.fileName);
var thisScriptPath=this$.parent.fsName;
// var thisScriptPath=USER_AdobeScriptFolder+'/MAJ-MetaData V1.2/';
var bridgeScriptName='BRIDGE-update-keywords.jsx';
var bt;
var flashBoxTime=1500;

//~ function setMajMDPal(aLink,anObj){
function setMajMDPal(anObj,closeCB){
    
            var myObj=anObj;
            var myLink=anObj.itemLink;debugln('myLink to UPDATE = '+myLink.name,4);
            var myPal=new Window('palette','Mettre à jour les Métadonnées ?');
            var largeurColGauche=270;
            var grp1=myPal.add('group{orientation:"column"}');
            var grp1ln=grp1.add('group{orientation:"row"}');         
            var oldMetaTitle=grp1ln.add('statictext{text:"Métadonnées actuelles :",justify:"right"}',undefined);
            oldMetaTitle.size={width:largeurColGauche,height:10};
            var oldMetaValue=grp1ln.add('edittext',[0,0,300,50],"",{multiline:true,readonly:true});
            oldMetaValue.text=myObj.keywordsString;
            var bClear=grp1.add('button',undefined,'Effacer les anciennes données');
            var grp2=myPal.add('group{orientation:"column"}');
            var grp2ln=grp2.add('group{orientation:"row"}');  
            var newMetaTitle=grp2ln.add('statictext{justify:"right"}',undefined);
            newMetaTitle.text='Méta-données à ajouter,\rséparées par ","';
            newMetaTitle.size={width:largeurColGauche,height:20};              

            var newMetaValue=grp2ln.add('edittext',[0,0,300,50],"",{multiline:true});
            newMetaValue.text=myObj.metaRefString;
            newMetaValue.active=true;

            var winHandlingGrp=myPal.add('group');
            var okButt=winHandlingGrp.add('button',undefined,'OK');
            var bCancel=winHandlingGrp.add('button',undefined,'Skip');
            
            myPal.cancel=function(){myPal.close();};
            okButt.onClick=okButtAction;
            bCancel.onClick=myPal.cancel;
            bClear.onClick=clearOldData;
            
            

            if(closeCB){
                myPal.onClose=closeCB;
            };

            function clearOldData(){
                var regex_checkString=new RegExp(/.*[a-zA-ZÙÀÌÒÈÂÊÎÛÔÄËÏÖÜèìòùàäëöüïêôûâîáéíóúÁÉÍÓÚ].*/);  //Pas complet mais déjà pas mal.
                var res=regex_checkString.test(oldMetaValue.text);
                if(res){
                    oldMetaValue.text=''; 
                };
           }
            
            function okButtAction(){
                var fullMetaValue;
                //-----concatène les anciennes et nouvelles refs : début
                if(oldMetaValue.text!=''){
                    fullMetaValue=oldMetaValue.text+','+newMetaValue.text;
                    }else{fullMetaValue=newMetaValue.text};
                //-----concatène les anciennes et nouvelles refs : fin
                var regex_checkString=new RegExp(/^(\d{5},)*\d{5}?$/);
//~                 var regex_checkString=new RegExp(/^(\d{5},)*\d{5}?$/);//Pour checker validité du champ des références.
                var res=regex_checkString.test(fullMetaValue);
                if(res){
                    
                    //-----Supprimer les refs en double : début
                    var arrFullMetaValue=fullMetaValue.split(',');
                    arrFullMetaValue=arrFullMetaValue.uniqueVal();
                    fullMetaValue=arrFullMetaValue.join(',');
                   //-----Supprimer les refs en double : fin
                   
                   //-----Check if old refs != new refs : début
                   var isNotSame=fullMetaValue != myObj.keywordsString;
                   //-----Check if old refs != new refs : fin
                   
                  var appendString=myObj.filePath+';'+fullMetaValue;
                    debugln(appendString,'4');
                    WriteLogLn(logFolder,'MAJ-data-temp\.txt',appendString);                    
                    if(isNotSame){
                        debugln('isNotSame is running',4);
                        sendToBridge(bt,fullMetaValue,myLink);//ENVOIE LES DONNEES VERS BRIDGE
                    }else{
                        flashBox('Métadonnées identiques',flashBoxTime);                        
                        };
                    myPal.close();
                }else{
                    alert('Le contenu du champ ne respecte pas le format (références de 5 chiffres séparées par des virgules).');
                };
            }

      return myPal;
} 

function sendToBridge(bt,aRefString,aLink){
   debugln('sendToBridge aRefString = '+aRefString,4);
   debugln('sendToBridge Path = '+aLink.filePath,4);
   bt = new BridgeTalk();
   var bridgeSpec=BridgeTalk.getSpecifier("bridge");
   bt.target=bridgeSpec;
   testeuh=new File(thisScriptPath+bridgeScriptName);
   var test285=new File(thisScriptPath+'/'+bridgeScriptName);
//    if(test285.exists){
//        alert(test285.fsName);
//    };
//    debugln('1)'+testeuh.fsName+'\r2)'+test285.fsName,5);
//    debugln('file to eval exists = '+testeuh.exists+'\r file to eval exists = '+test285.exists,5);
bt.body="var path='"+aLink.filePath+"'; var refsString='"+aRefString+"' ; $.evalFile('"+thisScriptPath+'/'+bridgeScriptName+"');";
bt.onResult=function(response){
                    if(response.body=='over'){
                        updateLink(aLink);
                        };
                    }
bt.send();
}

function updateLink(aLink){
    debugln(aLink.status,'1');//OK
var status=aLink.status.toString();
if (status=='LINK_OUT_OF_DATE'){
    aLink.update();
    flashBox('Lien actualisé',flashBoxTime);
    };
}