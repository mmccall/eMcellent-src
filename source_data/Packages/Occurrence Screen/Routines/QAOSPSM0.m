QAOSPSM0 ;HISC/DAD-SUMMARY OF OCCURRENCE SCREENING - GET DATA ;12/8/93  11:51
 ;;3.0;Occurrence Screen;**2,5**;09/14/1993
 K ^UTILITY($J,"QAOSPSM"),^UTILITY($J,"QAOSXREF"),^UTILITY($J,"QAOSPEND")
 K QAOSACTN,QAOSRV S QAOSLIST=""
 F QA=1:1:$L(QAOSLIST(0),",") D
 . S QAO=$P(QAOSLIST(0),",",QA)
 . S QAOSLIST=QAOSLIST_$S(QAO="1":"^N",QAO=2:"^L",QAO=3:"^1",1:"^")
 . Q
 S (QAOSNUM("N"),QAOSNUM("L"),QAOSNUM("1"))=1
 F QAOSCRN=0:0 S QAOSCRN=$O(^QA(741.1,"B",QAOSCRN)) Q:QAOSCRN'>0  D
 . F QAOSD0=0:0 S QAOSD0=$O(^QA(741.1,"B",QAOSCRN,QAOSD0)) Q:QAOSD0'>0  D
 .. S QAOS=$G(^QA(741.1,QAOSD0,0)),QA=$P(QAOS,"^",4)
 .. Q:QAOSLIST'[("^"_QA_"^")
 .. S ^UTILITY($J,"QAOSPSM",QA,QAOSNUM(QA))=+QAOS
 .. S ^UTILITY($J,"QAOSXREF",+QAOS)=QAOSNUM(QA)_"^"_QA
 .. S QAOSNUM(QA)=QAOSNUM(QA)+1
 .. Q
 . Q
 S QAOSCLIN=+$O(^QA(741.2,"C",1,0)),QAOSPEER=+$O(^QA(741.2,"C",2,0))
 S QAOSMGMT=+$O(^QA(741.2,"C",3,0)),QAOSRFPR=+$O(^QA(741.7,"B",2,0))
 F QA=1:1:16 S QAOSFIND(QA)=+$O(^QA(741.6,"B",QA,0))
 F QAOSDATE=QAQNBEG-.0000001:0 S QAOSDATE=$O(^QA(741,"C",QAOSDATE)) Q:(QAOSDATE'>0)!(QAOSDATE>(QAQNEND+.9999999))  F QAOSD0=0:0 S QAOSD0=$O(^QA(741,"C",QAOSDATE,QAOSD0)) Q:QAOSD0'>0  D LOOP1
 Q
LOOP1 ;
 S QAOSZERO=$G(^QA(741,QAOSD0,0)) Q:(QAOSZERO="")!($P(QAOSZERO,"^",11)=2)
 S QAOSSCRN=+$G(^QA(741,QAOSD0,"SCRN"))
 S QAOSSCRN(0)=$G(^QA(741.1,QAOSSCRN,0))
 S QAO=$G(^UTILITY($J,"QAOSXREF",+QAOSSCRN(0))),QAOSSEQ=+QAO
 S QAOSSTAT=$P(QAO,"^",2) Q:QAOSLIST'[("^"_QAOSSTAT_"^")
 S QAOSD1=+$O(^QA(741,QAOSD0,"REVR","B",QAOSCLIN,0))
 S QAOSCREV=$G(^QA(741,QAOSD0,"REVR",QAOSD1,0))
 ; If Exist(Peer) &' Exist(Clin) set QAOSCREV="."
 I QAOSCREV="",$O(^QA(741,QAOSD0,"REVR","B",QAOSPEER,0)) S QAOSCREV="."
 Q:QAOSCREV=""  ;  NO CLIN & NO PEER
 S QAOSFIND=+$P(QAOSCREV,"^",5) Q:QAOSFIND=QAOSFIND(3)  ;  EXCEPTION
 ;
 ;  MGMT actions
 K SERV S QAOSS1=0
 F  S QAOSS1=$O(^QA(741,QAOSD0,"REVR","B",QAOSMGMT,QAOSS1)) Q:QAOSS1'>0  D
 . S QA=$G(^QA(741,QAOSD0,"REVR",QAOSS1,0)),SERV=+$P(QA,"^",10)
 . Q:$G(SERV(SERV))  S SERV(SERV)=1,QAOSS2=0
 . F  S QAOSS2=$O(^QA(741,QAOSD0,"REVR",QAOSS1,2,QAOSS2)) Q:QAOSS2'>0  D
 .. S Y=+^QA(741,QAOSD0,"REVR",QAOSS1,2,QAOSS2,0),X=+$G(^QA(741.7,Y,0))
 .. S QAOSACTN(QAOSSTAT,X)=$G(QAOSACTN(QAOSSTAT,X))+1
 .. Q
 . Q
 ;  BED SERVICE SPECIFIC occur
 S QAOSHOSP=+$P(QAOSZERO,"^",5)
 S QAOSHOSP(0)=$G(^SC(QAOSHOSP,0))
 I $P(QAOSHOSP(0),"^",3)="C" D
 . S SERV=$P(QAOSHOSP(0),"^",8)
 . S:SERV="N" SERV="NE"
 . Q
 E  D
 . S QAOSWARD=+$G(^SC(QAOSHOSP,42))
 . S SERV=$P($G(^DIC(42,QAOSWARD,0)),"^",3)
 . Q
 S Y=+$P("^M1^NE1^S2^P3^I4^NH4^R4^SCI4^D4^B4","^"_SERV,2)
 I Y D
 . S X=1+$P($G(QAOSRV(QAOSSTAT,QAOSSEQ)),"^",Y)
 . S $P(QAOSRV(QAOSSTAT,QAOSSEQ),"^",Y)=X
 . S X=1+$P($G(QAOSRV(QAOSSTAT,QAOSSEQ)),"^",5)
 . S $P(QAOSRV(QAOSSTAT,QAOSSEQ),"^",5)=X
 . Q
 S QAOSTEMP=^UTILITY($J,"QAOSPSM",QAOSSTAT,QAOSSEQ)
 ;  # OCCUR REVIEWED CLINICALLY
 I QAOSCREV'="." S $P(QAOSTEMP,"^",2)=$P(QAOSTEMP,"^",2)+1
 ;  # OCCUR REFERRED PEER (CLIN & NO PEER FOUND)
 I $O(^QA(741,QAOSD0,"REVR",QAOSD1,2,"B",QAOSRFPR,0)) D
 . I $O(^QA(741,QAOSD0,"REVR","B",QAOSPEER,0))'>0 D
 .. S $P(QAOSTEMP,"^",3)=$P(QAOSTEMP,"^",3)+1 ; # REFERRED PEER
 .. S $P(QAOSTEMP,"^",7)=$P(QAOSTEMP,"^",7)+1 ; PEER: PENDING
 .. D PEND(1)
 .. Q
 . Q
 ;  OUTCOME PEER: LEVELS 1,2,3
 K SERV S QAOSS1=0
 F  S QAOSS1=$O(^QA(741,QAOSD0,"REVR","AONLY1",1,QAOSS1)) Q:QAOSS1'>0  D
 . S QA=$G(^QA(741,QAOSD0,"REVR",QAOSS1,0))
 . Q:($P(QA,"^")'=QAOSPEER)!($P(QA,"^",9)'>0)  ;  NOT PEER ! NOT FINAL
 . S QAOSLEVL=$P(QA,"^",5),SERV=+$P(QA,"^",10),SERV(SERV)=1
 . S $P(QAOSTEMP,"^",3)=$P(QAOSTEMP,"^",3)+1 ; # REFERRED PEER
 . I QAOSLEVL=QAOSFIND(11) S $P(QAOSTEMP,"^",4)=$P(QAOSTEMP,"^",4)+1
 . I QAOSLEVL=QAOSFIND(12) S $P(QAOSTEMP,"^",5)=$P(QAOSTEMP,"^",5)+1
 . I QAOSLEVL=QAOSFIND(13) S $P(QAOSTEMP,"^",6)=$P(QAOSTEMP,"^",6)+1
 . Q
 ;  OUTCOME PEER: PENDING
 S QAOSS1=0
 F  S QAOSS1=$O(^QA(741,QAOSD0,"REVR","B",QAOSPEER,QAOSS1)) Q:QAOSS1'>0  D
 . S SERV=+$P($G(^QA(741,QAOSD0,"REVR",QAOSS1,0)),"^",10)
 . Q:$G(SERV(SERV))  S SERV(SERV)=1
 . S $P(QAOSTEMP,"^",3)=$P(QAOSTEMP,"^",3)+1 ; # REFERRED PEER
 . S $P(QAOSTEMP,"^",7)=$P(QAOSTEMP,"^",7)+1 ; PEER: PENDING
 . D PEND(2)
 . Q
 ;  # OCCUR REFERRED SYS PROB
 F X=5,7,8,9 I QAOSFIND=QAOSFIND(X) D  Q
 . S $P(QAOSTEMP,"^",8)=$P(QAOSTEMP,"^",8)+1
 . Q
 ;  # OCCUR REFERRED EQUIP PROB
 F X=4,6,8,9 I QAOSFIND=QAOSFIND(X) D  Q
 . S $P(QAOSTEMP,"^",9)=$P(QAOSTEMP,"^",9)+1
 . Q
 S ^UTILITY($J,"QAOSPSM",QAOSSTAT,QAOSSEQ)=QAOSTEMP
 Q
PEND(Y) ;  SAVE PENDING , PENDING TYPE (Y=1/2)
 S QAOSDPT=$G(^DPT(+QAOSZERO,0)),QAOSSN=$P(QAOSDPT,"^",9)
 S QAOSPAT=$S($P(QAOSDPT,"^")]"":$P(QAOSDPT,"^"),1:+QAOSZERO)
 S QAOSDATE=+$P(QAOSZERO,"^",3),X=QAOSSN_"^"_Y
 S ^UTILITY($J,"QAOSPEND",QAOSSCRN,QAOSDATE,QAOSPAT,QAOSD0)=X
 Q
