QAOSPSR0 ;HISC/DAD-OCCURRENCE SCREENS BY SERVICE ;2/12/93  15:26
 ;;3.0;Occurrence Screen;;09/14/1993
 D ^QAQDATE G:QAQQUIT EXIT K %ZIS,IOP
 K ^UTILITY($J,"P"),^UTILITY($J,"QAOSSCRN"),^UTILITY($J,"QAOSSERV")
 K QAQDIC S QAQDIC="^DIC(49,",QAQDIC(0)="AEMNQZ",QAQDIC("A")="Select SERVICE: "
 S QAQUTIL="QAOSSERV" D ^QAQSELCT G:QAQQUIT EXIT
 K QAQDIC S QAQDIC="^QA(741.1,",QAQDIC(0)="AEMNQZ",QAQDIC("A")="Select SCREEN: "
 S QAQDIC("B")="ALL",QAQUTIL="QAOSSCRN" D ^QAQSELCT G:QAQQUIT EXIT
DEV ;
 K %ZIS S %ZIS="QM" W ! D ^%ZIS G:POP EXIT
 I $D(IO("Q")) S ZTRTN="ENTSK^QAOSPSR0",ZTDESC="Occurrences by service",(ZTSAVE("QAO*"),ZTSAVE("QAQ*"),ZTSAVE("^UTILITY($J,"))="" D ^%ZTLOAD G EXIT
ENTSK ;
 S QAOSQUIT=0 F QAOSDATE=QAQNBEG-.0000001:0 S QAOSDATE=$O(^QA(741,"C",QAOSDATE)) Q:(QAOSDATE'>0)!(QAOSDATE>QAQNEND)!(QAOSQUIT)  F QAOSD0=0:0 S QAOSD0=$O(^QA(741,"C",QAOSDATE,QAOSD0)) Q:QAOSD0'>0  D LOOP1
PRINT ;
 U IO S SERV="",Y=DT X ^DD("DD") S TODAY=$P(Y,"@"),PAGE=1 K UNDL S $P(UNDL,"-",80)="-",QAOSQUIT=0 I '$D(^UTILITY($J,"P")) D HEAD W !!,"*** NO OCCURRENCES FOUND IN THE SELECTED DATE RANGE ***" G EXIT
 F SER=0:1 S SERV=$O(^UTILITY($J,"P",SERV)) Q:SERV=""!QAOSQUIT  D PAUSE:$E(IOST)="C"&SER Q:QAOSQUIT  D HEAD,SUBHEAD,PRT1
EXIT ;
 W ! D ^%ZISC
 K %ZIS,DATE,LOC,NAM,NAME,PAGE,POP,QAOSD0,QAOSDATE,QAOSQUIT,SCRN,SCRNTXT,SER,SERV,SSN,STAT,TODAY,TXSP,UNDL,X,Y,Z,ZTDESC,ZTRTN,ZTSAVE,%DT,D,I,Y,QAQDIC,QAQUTIL,^UTILITY($J,"P"),^UTILITY($J,"QAOSSCRN"),^UTILITY($J,"QAOSSERV")
 D K^QAQDATE S:$D(ZTQUEUED) ZTREQ="@"
 Q
PRT1 ;
 F SCRN=0:0 S SCRN=$O(^UTILITY($J,"P",SERV,SCRN)) Q:SCRN'>0!QAOSQUIT  S NAME="" F NAM=0:0 S NAME=$O(^UTILITY($J,"P",SERV,SCRN,NAME)) Q:NAME=""!QAOSQUIT  F DATE=0:0 S DATE=$O(^UTILITY($J,"P",SERV,SCRN,NAME,DATE)) Q:DATE'>0!QAOSQUIT  D PRT2
 Q
PRT2 ;
 S LOC=^UTILITY($J,"P",SERV,SCRN,NAME,DATE),TXSP=$P(LOC,"^"),SCRNTXT=$P(LOC,"^",2),STAT=$P(LOC,"^",3),SSN=$P(LOC,"^",4),Y=DATE\1 X ^DD("DD")
 W !!,NAME,?32,SSN,?43,Y,?56,STAT,?65,$E(TXSP,1,15),!?1,SCRN,?8,$E(SCRNTXT,1,72)
 S Z=$O(^UTILITY($J,"P",SERV,SCRN))_$O(^UTILITY($J,"P",SERV,SCRN,NAME))_$O(^UTILITY($J,"P",SERV,SCRN,NAME,DATE))
 I $Y>(IOSL-6) D:$E(IOST)="C" PAUSE:Z]"" Q:QAOSQUIT  D:Z]"" HEAD,SUBHEAD
 Q
LOOP1 ;
 S LOC=^QA(741,QAOSD0,0),SCRN=+$G(^("SCRN")),SCRNTXT="" S:$D(^QA(741.1,SCRN,0))#2 SCRN=+^(0),SCRNTXT=$P(^(0),"^",2)
 Q:$D(^UTILITY($J,"QAOSSCRN",SCRN,SCRN))[0
 S SERV=$P(LOC,"^",6),TXSP=$P(LOC,"^",7),STAT=$P(LOC,"^",11) Q:STAT=2  S STAT=$S(STAT=1:"CLOSED",1:"OPEN")
 S NAME=+LOC,LOC=$G(^DPT(+LOC,0)),NAME=$S($P(LOC,"^")]"":$P(LOC,"^"),1:NAME),SSN=$P(LOC,"^",9) S:NAME="" NAME=+LOC
 S SERV(0)=$P($G(^DIC(49,+SERV,0)),"^") Q:SERV(0)=""
 Q:$D(^UTILITY($J,"QAOSSERV",SERV(0),SERV))[0
 S:TXSP]"" TXSP=$S($D(^DIC(45.7,TXSP,0))#2:$P(^(0),"^"),1:TXSP)
 S ^UTILITY($J,"P",SERV(0),SCRN,NAME,QAOSDATE)=TXSP_"^"_SCRNTXT_"^"_STAT_"^"_SSN
 Q
HEAD ;
 W:(PAGE>1)!($E(IOST)="C") @IOF
 W !!?29,"OCCURRENCES BY SERVICE",?68,TODAY,!?QAQTART,QAQ2HED,?68,"PAGE: ",PAGE S PAGE=PAGE+1
 D EN6^QAQAUTL
 W !,"PATIENT / SCREEN",?32,"SSN",?43,"DATE",?56,"STATUS",?65,"TREATING SPEC.",!,UNDL
 Q
 Q
SUBHEAD ;
 W !!,"   SERVICE: ",SERV
 Q
PAUSE ;
 K DIR S DIR(0)="E" D ^DIR K DIR S QAOSQUIT=$S(Y'>0:1,1:0)
 Q
