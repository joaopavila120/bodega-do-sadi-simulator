'use strict';

let paymentFeedback={total:0,tips:0,until:0,state:null};
function showPaymentFeedback(total,tips){
 const now=performance.now();
 if(paymentFeedback.state!==G||paymentFeedback.until<now)paymentFeedback={total:0,tips:0,until:0,state:G};
 paymentFeedback.total+=total;paymentFeedback.tips+=tips;paymentFeedback.until=now+3500;updatePaymentFeedback();
}
function updatePaymentFeedback(){
 const active=paymentFeedback.state===G&&performance.now()<paymentFeedback.until;
 $('paymentFeedback').textContent=active?'+'+money(paymentFeedback.total):'';
 $('paymentFeedback').title=active?'Gorjeta incluída: '+money(paymentFeedback.tips):'';
}
