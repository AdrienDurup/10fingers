//V 1.0

//@target 'indesign';
//@targetengine 'DBHandling';
//@include 'MAJMetaData-objects.jsx';
//@include '../API/logFolder.jsx';
//@include 'MAJMetaData_CommonFunctions.jsx';
var majmd={};
var myDoc=app.activeDocument;
var myPages=myDoc.spreads;
var win=[];
var idWin=0;
var max; 
var arrRefs=[];
var arrLinks=[];
var arrObj=[];
var debug={'1':false,'2':false,'3':false,'4':false,'5':true};
try{
    var mySelec=myDoc.selection;
    var mySelecLen=mySelec.length;
    }catch(error){alert('Aucune sélection. '+error);};

//debugln('VS TEST',1);//OK

processGraph(mySelec);   

function getRefs(aTxt){
     var refsRE=/\d{5}/g; 
    var myRefs=[];
    if(aTxt!=''){
            myRefs=aTxt.match(refsRE);//$.writeln('getRefs : '+myRefs+' '+myRefs.length);
            myRefs=myRefs.uniqueVal();//strictFilter search for string containing 5 numbers in a row. //uniqueVal() efface les valeurs en doublon
            }else{myRefs[0]='';};
     return myRefs;
}
function getLinks(graphs){//NE doit pas empecher de fonctionner si vide
        var graphLinks=new Array();
        var graphLen=graphs.length;
        for(var v=0;v<graphLen;v++){
            if(graphs[v].itemLink!=undefined){
                 graphLinks.push(graphs[v].itemLink);   
                 };
             };
        return graphLinks;
}
 
function processGraph(mySelec){
    var myGraphs=new Array();
    var wholeTxt='';
    for(k=0;k<mySelecLen;k++){
            if(mySelec[k].contentType.toString()=='GRAPHIC_TYPE'){ 
                        myGraphs.push(mySelec[k].graphics[0]);
                        };
             if(mySelec[k].contentType.toString()=='TEXT_TYPE'&&mySelec[k].contents!=''){   
                 wholeTxt+=' '+mySelec[k].parentStory.contents;
                 };
    };

    arrRefs=getRefs(wholeTxt);
    arrLinks=getLinks(myGraphs);

    max=arrLinks.length;
callWin();
}

//POUR EVITER SUPERPOSITIONS : FAIRE VERSION AVEC CALLBACK
//FAIRE QUE SI LA PREMIERE EST VALIDEE, TOUTES LES AUTRES LE SONT AVEC LES MEMES VALEURS

function callWin(){//----Appelle la fenêtre
    for(var i=0;i<max;i++){
        var obj1=new MajMD_Entity(arrRefs,arrLinks[i]);//----Recupere les infos dans des objets
        win=new setMajMDPal(obj1);//instancie la fenêtre
        win.show();   
        };
    }