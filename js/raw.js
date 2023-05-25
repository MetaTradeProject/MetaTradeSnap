const raw_block = JSON.parse(window.sessionStorage.getItem('data'))
const trade_list = raw_block["blockBody"];
const idx = window.sessionStorage.getItem('idx')
let is_expand_flag=[]

$('#raw-p').text('Raw Block No.' + idx)

$('#raw-block-trades').bootstrapTable({
    columns: [
        {
            field: 'id', title: 'Trade Index'
        }, {
            field: 's', title: 'Sender'
        },{
            field: 'amount', title: 'Amount'
        },{
            field: 'r', title: 'Receiver'
        },{
            field: 'd', title: 'Time'
        }
    ],
    onClickRow: function(row, $element, field){
        const index = row['id']
        const this_tr_id = "tr-info-detail" + index.toString()

        if(is_expand_flag[index]){
            is_expand_flag[index] = false
            $("#"+this_tr_id).remove()
        }
        else{
            $element.after('<tr id="'+ this_tr_id +'">\n' +
                '        <td colspan="5">\n' +
                '          <div id = "raw-info">'+
                '<br />Sender: '+ trade_list[index]["senderAddress"] +
                '<br />Receiver: '+ trade_list[index]["receiverAddress"] +
                '<br />Signature: '+ trade_list[index]["signature"] +
                '<br />Public key: '+ trade_list[index]["senderPublicKey"] +
                '          </div></td>\n' +
                '      </tr>')
            is_expand_flag[index] = true
        }
    }
});

for(let i = 0; i < trade_list.length; i++) {
    const row =
        {
            "id": "",
            "s": "",
            "amount": "",
            "r": "",
            "d": ""
        };
    let trade = trade_list[i]
    row.id = i.toString()
    row.s = trade["senderAddress"]
    row.r = trade["receiverAddress"]
    if(trade["amount"] !== 0){
        row.amount=trade["amount"].toString()
    }
    else{
        let item_msg = JSON.parse(trade["description"]);
        row.amount=item_msg["amount"]+'('+item_msg["id"]+')';
    }
    const td_date = new Date()
    td_date.setTime(trade["timestamp"]);
    row.d = td_date.toLocaleDateString() + ' ' + td_date.toLocaleTimeString()

    is_expand_flag.push(false)
    $('#raw-block-trades').bootstrapTable('append', row);
}