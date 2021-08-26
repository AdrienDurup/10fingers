//@target indesign;
//@targetengine "pageBisHandling";// à faire raccord avec l'autre script

var myDoc=app.activeDocument;
var myPages=myDoc.pages;
var mySections=myDoc.sections;
var myActivePage=myDoc.layoutWindows[0].activePage;
var appliedSection=myActivePage.appliedSection;
var activeIsValid=appliedSection.pageStart===myActivePage&&appliedSection!==mySections[0];

function delAllSections(){
    while(mySections.length>1){
        mySections[1].remove();
    };
}

function delActiveSection(){
if(activeIsValid){
    appliedSection.remove();
    };
//Tester s'il y a une section sur page active au moment de l'instanciation de la fenetre
}
//~ delActiveSection();

//~ for(var i=1;i<mySections.length;i++){
//~     mySections[i].remove();
//~  
//~  };
function delSecPal(){
    var w=new Window('palette');
    var myLbl=w.add ('statictext',undefined,'Effacer la section secondaire active / toutes les sections secondaires ?');
    if(activeIsValid){
    var but_delActive=w.add ('button',undefined,'Delete active section');
    but_delActive.onClick=function(){w.close();delActiveSection();};
    };
    var but_delAll=w.add ('button',undefined,'Delete all');
    var but_Cancel=w.add ('button',undefined,'Cancel');
    

    but_delAll.onClick=function(){w.close();delAllSections();};
    but_Cancel.onClick=function(){w.close();};
        
    return w;
    
    }
var myPal=delSecPal();
myPal.show();