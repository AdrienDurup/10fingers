//@target bridge;
//@include '../API/logFolder.jsx';
//@include '../API/toolbox.jsx';

//------------------------Methode pour mettre a jour la metadata ref d'un thumbnail donné REQUIERT UNE INITIALISATION DANS MAIN------------------------------------------------------------------------------
//See for reference guide to XMPScript http://estk.aenhancers.com/10%20-%20Scripting%20Access%20to%20XMP%20Metadata/xmpscript-object-reference.html
Thumbnail.prototype.SetMD_Refs = function(){
var fileIsUpdated=false;
                    //ENLEVER LES DOUBLONS de REFERENCE (faire ça dans ce script avant mise à jour)
if(this.references!=''&&this.references!==undefined){
        if(this.hasMetadata){
            var xmp = new XMPMeta(this.metadata.serialize());
            }else{//SI PAS DE METADATA :
                //---------Recréer des métadonnées (le champ de mots clés)
                var xmp=new XMPMeta();
                xmp.setProperty(XMPConst.NS_DC, 'subject',null,XMPConst.PROP_IS_ARRAY);
                var xmpSeriz=xmp.serialize(XMPConst.SERIALIZE_OMIT_PACKET_WRAPPER | XMPConst.SERIALIZE_USE_COMPACT_FORMAT);
                debugln('xmpSeriz = '+xmpSeriz, 5);
                this.metadata=new Metadata(xmpSeriz);
                //---------
                //--------- Write updated metadata into the file
                var myXMPFile = new XMPFile( this.spec.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE );
                if ( myXMPFile.canPutXMP( xmp ) ) {
                     myXMPFile.putXMP( xmp );
                     myXMPFile.closeFile( XMPConst.CLOSE_UPDATE_SAFELY );
               //--------- 
                    }else{
                        //---------HASMETADATA : FALSE --> Inscrire le fichier dans un LOG
                        var file_setMDHasFailed=new File(logFolder+'\/'+'SetMetaHasFailed_LOG\.txt');
                        file_setMDHasFailed.open('a');
                        file_setMDHasFailed.writeln(this.spec.fsName);
                        file_setMDHasFailed.close();
                        //---------
                        };//fin else 2
          
                };//fin else 1 
//~             $.writeln(('hasMetadata : '+(this.hasMetadata)));
            
            
       
        //------- Mise à jour du champ 'KeyWords' en DC
        var arrXmpKeywords=this.references;
        var subjectLen=xmp.countArrayItems(XMPConst.NS_DC, 'subject');
    if(xmp.doesArrayItemExist(XMPConst.NS_DC, 'subject',1)){
        xmp.deleteProperty(XMPConst.NS_DC, 'subject');
        };
    xmp.setProperty(XMPConst.NS_DC, 'subject',null,XMPConst.PROP_IS_ARRAY);
    for (var i=0;i<arrXmpKeywords.length;i++){
            xmp.appendArrayItem(XMPConst.NS_DC, 'subject',arrXmpKeywords[i]);//VERIFIER AVEC UNE LIGNE DE $.WRITELN
        };
 
//------- Convertit le nouveau paquet en chaîne de caractères
        var updatedPacket = xmp.serialize(XMPConst.SERIALIZE_OMIT_PACKET_WRAPPER | XMPConst.SERIALIZE_USE_COMPACT_FORMAT);
        //------- met à jour les métadonnées dans le thumbnail
        this.metadata = new Metadata(updatedPacket);
                //------- met à jour les métadonnées dans le fichier
        var myXMPFile2 = new XMPFile( this.spec.fsName, XMPConst.UNKNOWN, XMPConst.OPEN_FOR_UPDATE );
        if( myXMPFile2.canPutXMP( xmp ) ) {
                     myXMPFile2.putXMP( xmp );
                     myXMPFile2.closeFile( XMPConst.CLOSE_UPDATE_SAFELY );
                     fileIsUpdated=true;
                    };
//~         $.writeln(this.spec.name+' Updated');
        }//IF DU DEBUT
    else{$.writeln('FAIL : '+this.spec.name);};
    return fileIsUpdated;    
    }
//-------------------------------------------------------------------------

