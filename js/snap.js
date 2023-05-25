let snap_msg;
let is_expand_flag=[];
let is_expand_raw_flags=[];
let is_expand_trade_flags=[];

$('#block-list').bootstrapTable({
    columns: [
        {
            field: 'id', title: 'Block Index'
        }, {
            field: 'tc', title: 'Trade Count'
        },{
            field: 'com', title: 'Commission'
        },{
            field: 'amount', title: 'Total amount'
        }
    ],
    onClickRow: function(row, $element, field){
        const index = row['id']
        const this_tr_id = "tr-block-detail" + index.toString()

        if(is_expand_flag[index]){
            is_expand_flag[index] = false
            $("#"+this_tr_id).remove()
        }
        else{
            $element.after('<tr id="'+ this_tr_id +'">\n' +
                '        <td colspan="4">\n' +
                '          <div class="block-ex-info" id="blockdetail'+index.toString()+'\"' + '>\n' +
                '     Prev Hash: ' + snap_msg["chain"][index]["prevHash"]  +
                '<br />Merkle Hash: ' + snap_msg["chain"][index]["merkleHash"] +
                '<br />Proof Level: '+ snap_msg["chain"][index]["proofLevel"] +
                '<br />Proof: '+ snap_msg["chain"][index]["proof"]  +
                '          </div></td>\n' +
                '      </tr>')
            is_expand_flag[index] = true
        }
    }
});

$('#raw-list').bootstrapTable({
    columns: [
        {
            field: 'id', title: 'Block Index'
        }, {
            field: 'tc', title: 'Trade Count'
        },{
            field: 'com', title: 'Commission'
        },{
            field: 'amount', title: 'Total amount'
        },{
            field: 'operate',
            title: '',
            align: 'center',
            valign: 'middle',
            width: 40,
            events: {
                'click #raw-detail-btn': function (e, value, row, index) {
                    const raw = snap_msg["rawBlocks"][row['id']]
                    window.sessionStorage.setItem('data', JSON.stringify(raw));
                    window.sessionStorage.setItem('idx', row['id']);
                    location.assign("raw.html");
                }
            },
            formatter: function (value, row, index) {
                var result = "";
                result += '<a id="raw-detail-btn"><img src="icon/detail.svg" onmouseout="this.src=\'icon/detail.svg\'" onmouseover="this.src=\'icon/detail-bg.svg\'" width="25" height="25" alt="Detail"></a>';
                return result;
            }
        }
    ],
    onClickRow: function(row, $element, field){
        const index = row['id']
        const this_tr_id = "tr-raw-detail" + index.toString()

        if(is_expand_raw_flags[index]){
            is_expand_raw_flags[index] = false
            $("#"+this_tr_id).remove()
        }
        else{
            $element.after('<tr id="'+ this_tr_id +'">\n' +
                '        <td colspan="5">\n' +
                '          <div id = "raw-info">'+
                '<br />Proof Level: '+ snap_msg["chain"][index]["proofLevel"] +
                '          </div></td>\n' +
                '      </tr>')
            is_expand_raw_flags[index] = true
        }
    }
});

$('#trade-list').bootstrapTable({
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

        if(is_expand_trade_flags[index]){
            is_expand_trade_flags[index] = false
            $("#"+this_tr_id).remove()
        }
        else{
            $element.after('<tr id="'+ this_tr_id +'">\n' +
                '        <td colspan="5">\n' +
                '          <div id = "trade-detail-info">'+
                '<br />Sender: '+ trade_list[index]["senderAddress"] +
                '<br />Receiver: '+ trade_list[index]["receiverAddress"] +
                '<br />Signature: '+ trade_list[index]["signature"] +
                '<br />Public key: '+ trade_list[index]["senderPublicKey"] +
                '          </div></td>\n' +
                '      </tr>')
            is_expand_trade_flags[index] = true
        }
    }
});


const Http = new XMLHttpRequest();
const url='https://47.102.200.110/meta-trade/snap';
Http.open("GET", url);
Http.send();

Http.onreadystatechange = (e) => {
    if (Http.readyState === 4 && Http.status === 200){
        snap_msg = JSON.parse(Http.responseText);
        const block_chain_json = snap_msg["chain"]
        for(let i = 0; i < block_chain_json.length; i++) {
            const row =
                {
                    "id": "",
                    "tc": "",
                    "com": "",
                    "amount": ""
                };
            let block = block_chain_json[i]
            row.id = (i).toString()
            row.tc = block["blockBody"].length.toString()
            let commission = 0, total = 0
            for(let j = 0; j < block["blockBody"].length; j++){
                commission += block["blockBody"][j]["commission"]
                total += block["blockBody"][j]["amount"]
            }
            row.com = commission.toString()
            row.amount = total.toString()
            is_expand_flag.push(false)
            $('#block-list').bootstrapTable('append', row);
        }


        const raw_json = snap_msg["rawBlocks"]
        for(let i = 0; i < raw_json.length; i++) {
            const row =
                {
                    "id": "",
                    "tc": "",
                    "com": "",
                    "amount": ""
                };
            let raw_block = raw_json[i]
            row.id = i.toString()
            row.tc = raw_block["blockBody"].length.toString()
            let commission = 0, total = 0
            for(let j = 0; j < raw_block["blockBody"].length; j++){
                commission += raw_block["blockBody"][j]["commission"]
                total += raw_block["blockBody"][j]["amount"]
            }
            row.com = commission.toString()
            row.amount = total.toString()
            is_expand_flag.push(false)
            $('#raw-list').bootstrapTable('append', row);
        }

        const trade_list = snap_msg["tradeList"]
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

            is_expand_trade_flags.push(false)
            $('#trade-list').bootstrapTable('append', row);
        }
    }
}