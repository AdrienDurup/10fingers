//@target indesign;
//@targetengine 'MAJ-MetaData';
var scriptFile=new File($.fileName);
var fileToLaunch=new File(scriptFile.parent.fsName+'/src/MAJ-MetaData V1.2/MAJ-MetaData-INDDSide.jsx');
if(fileToLaunch.exists){
    try{
          $.evalFile(fileToLaunch);  
        //   alert("aftereval is launched");
    }catch(e){alert(e);};
}else{
    alert('Script introuvable.');
    };