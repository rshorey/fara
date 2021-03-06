// I am trying to add the merge form. It is not working properly yet
jQuery(document).ready(function() {

  var direct = {
    success: function(response, statusText, xhr, h){
      var error = response.error
      if (typeof error== 'undefined'){
        console.log(response);
        window.top.location.href="/supplemental_list";
      }
      else{
        console.log("error")
        var message = "Error: " + response.error;
        alert(message);
      }  
    }
  }

$("#metaform").ajaxForm(direct);

});  

// Date picker 
$(function() {
  $("#contact_date").datepicker();
  $("#disbursement_date").datepicker();
  $("#payment_date").datepicker();
  $("#contribution_date").datepicker();
  $("#gift_date").datepicker();
  $("#stamp_date").datepicker();
  $("#end_date").datepicker();

  //this is the search function, select2
  function createSelect(tag, resourse){
    
    $(tag).select2({
      minimumInputLength: 2,
      allowClear: true,
      
      query: function(query) {

        $.getJSON(resourse, {q: query.term}, function(results){
          // console.log(results);
            
            data = {
              results: results
            };
            // results is now set to [{id: "whatever", text: "whatever"}]

          query.callback(data);
        });
      }
    });
  }
  function createMSelect(tag, resourse){
    
    $(tag).select2({
      minimumInputLength: 2,
      allowClear: true,
      multiple: true,
      query: function(query) {

        $.getJSON(resourse, {q: query.term}, function(results){
          // console.log(results);
            
            data = {
              results: results
            };
            // results is now set to [{id: "whatever", text: "whatever"}]

          query.callback(data);
        });
      }
    });
  }

createMSelect("#contact_recip", "/formchoices/recip");
createMSelect("#client_client", "/formchoices/client");
createMSelect("#lobbyist_lobbyist", "/formchoices/lobbyist");
createSelect("#cont_recip", "/formchoices/recip");
createSelect("#client_location", "/formchoices/location");
createSelect("#disbursement_subcontractor", "/formchoices/reg");
createSelect("#primary_contractor", "/formchoices/reg")
createSelect("#payment_subcontractor", "/formchoices/reg");
createSelect("#gift_recip", "/formchoices/recip");
createSelect("#correct_recip","/formchoices/recip");
createSelect("#wrong_recip","/formchoices/recip");
});


// This posts new data without refreshing the page and updates choices

jQuery(document).ready(function() {
  var options = {
    success: function(responses, statusText, xhr, h){
    
        //response is an array of JSON objects returned from the server
        for (var i=0; i<responses.length; i += 1) {
          var response = responses[i];

          var name = response.name;
          var id = response.id;

          // 1) update forms (I still need this even with select 2)
          var option = "<option value='" + id + "'>" + name + "</option>";
          $("#contact_client").append(option);
          $("#pay_client").append(option);
          $("#dis_client").append(option);
          $("#gift_client").append(option);
          $("#terminated_client").append(option);
          var ab_option = '<p><label for="client">Clients:</label><select name="client" id="ab_client">' + option + '</option>'
          $("#ab_client").replaceWith(ab_option);
      
          // 2) update list
          var item = "<li>" + name + "</li>"
          $("#client_list").append(item);

          // 3) clear form
          $('#clientform').each(function(){
              this.reset();   
          });
          $('#add_clientform').each(function(){
              this.reset(); 
          });

          // clears select2 boxes
          var $client_location = $('#client_location');
          $client_location.select2('data', null);
          var $location = $('#location');
          $location.select2('data', null);
          var $client_client = $('#client_client');
          $client_client.select2('data', null);

        }     
      //}
    }, 
    
    error: function(jqxhr, errorText, error){
        var message = "Error: " + error
        alert(message)
    },
  } 
  jQuery("#clientform").ajaxForm(options);
  jQuery("#add_clientform").ajaxForm(options);
   
  var contact_options = {
    success: function(responseText, statusText, xhr, h){

        update_option('<option value="{{ client.id }}">{{ client.client_name }}</option>', '#contactform', '#contact_client');
    } 
  }      
});


//  This posts new lobbyist data without refreshing the page and updates the lobbyist choices 

jQuery(document).ready(function(){
  function clearlselect(){
    var $lobbyist_lobbyist = $('#lobbyist_lobbyist');
    $lobbyist_lobbyist.select2('data', null);
    console.log("running")
  }
  var lobby_options = {
    success: function(responses, statusText, xhr, h){
      for (var i=0; i<responses.length; i += 1) {
        var response = responses[i];

        if (typeof response.error== 'undefined'){
          var name = response.name;
          var id = response.id;
          console.log(name)
          // 1) update forms (I still need this even with select 2)
          var option = "<option value='" + id + "'>" + name + "</option>";
          $("#contact_lobbyist").append(option);
          $("#cont_lobbyist").append(option);
      
          // 2) update list
          var item = "<li>" + name + "</li>";
          $("#lobby_list").append(item);

          // 3) clear form
          $('#lobbyform').each(function(){
              this.reset();   
          });
          $('#add_lobbyform').each(function(){
              this.reset(clearlselect());   
          });
        }

        else{
          var errors = response.error
          var message = "Error: " + errors
          alert(message)
        } 
      } 
    },
    error: function(jqxhr, errorText, error){
      var message = "Error: failed"
      alert(message)
    },
  }


jQuery("#lobbyform").ajaxForm(lobby_options);
jQuery("#add_lobbyform").ajaxForm(lobby_options);
 
var contact_options = {
    success: function(responseText, statusText, xhr, h){
      update_option('<option value="{{ client.id }}">{{ client.client_name }}</option>', '#contactform', '#contact_client');
    } 
  }     
});

// Functions for keeping track of totals

var total_pay = function pay_totaler(){
  var pay_total = 0;
  var pay = document.getElementsByClassName('pay');
  for (var i=0, max=pay.length; i < max; i++){
    var p = parseFloat(pay[i].innerHTML.slice(1))
    pay_total += p;
  }
  var pay_total_txt = "$" + (pay_total).toFixed(2);
  $('#pay_total').html(pay_total_txt); 
};

var total_dis = function dis_totaler(){
  var dis_total = 0;
  var dis = document.getElementsByClassName('dis');
  for (var i=0, max=dis.length; i < max; i++){
    var d = parseFloat(dis[i].innerHTML.slice(1))
    dis_total += d;
  }
  var dis_total_txt = "$" + (dis_total).toFixed(2);
  $('#dis_total').html(dis_total_txt); 
};


// adding ajax  and updating

jQuery(document).ready(function(){
  total_pay()
  total_dis()
  function update(tag){

    var opt = {
      success: function(response, statusText, xhr, h){
        var error = response.error
        if (typeof error== 'undefined'){
          
          var no_clear = response.do_not_clear;
          if (no_clear == "on"){
                console.log("clear on")
          }
          else{
            $(tag).each(function(){
              this.reset();
            }); 
          }

          //3) update display
          // console.log(response);

          if (tag == "#stampform"){
            var date = response.date;
            var id = response.id;
            var item = '<div id="stamp_list"><p>' + date + "</p><div>";
            console.log(item);
            $("#stamp_list").replaceWith(item);
          }

          if (tag == "#terminatedclientform"){
            for (var i=0; i<response.length; i += 1) {
              var responses = response[i];
              var name = responses.name;
              var id = responses.id;
              var item = "<li>" + name + "</li>";
            $("#terminated_client_list").append(item)
            }
          }

          if (tag == "#contactform"){
            var date = response.date;
            var name = response.name;
            var contact_id = response.contact_id;
            var link_to = '/fix_contact/' + contact_id;
            var pop = "<a class='js-popup pull-right' href= " + '"' + link_to + '">';
            var item = "<li>"+ name + " " + date + pop + ' Fix</a>'+ '</li>';
            $("#contact_list").append(item);
            var $contact_recip = $('#contact_recip');
            $contact_recip.select2('data', null)
          }

          if (tag == "#payform"){
            var amount = response.amount;
            var date = response.date;
            var client = response.client;
            var fee = response.fee;
            var pay_id = response.pay_id;
            
            if(response.fee == true) {
              var fee = '<span class="glyphicon glyphicon-ok"></span>';
            } else {
              var fee = "No";
            }

            var link_to = '/fix_payment/' + pay_id
            var item = '<tr><td class="pay">$'+ amount + '</td><td>'+ client +'</td><td>'+ date +'</td><td>'+ fee +'</td><td><a class="js-popup" href="' + link_to + '">Fix</a></td></tr>';
            $('#pay_table').append(item);
            var $payment_subcontractor = $('#payment_subcontractor');
            $payment_subcontractor.select2('data', null);
            total_pay()

          }

          if (tag == "#disform"){
            var amount = response.amount;
            var date = response.date;
            var client = response.client;
            var dis_id = response.dis_id;

            link_to = '/fix_disbursement/' + dis_id
            item = '<tr><td class="dis">$'+ amount +'</td><td>'+ date + '</td><td>'+ client +'</td><td><a class="js-popup" href= "' + link_to + '">Fix</a></td></tr>';
            $('#dis_table').append(item);
            var $disbursement_subcontractor = $('#disbursement_subcontractor');
            $disbursement_subcontractor.select2('data', null)
            total_dis()
          }

          if (tag == '#contform'){
            
            var amount = response.amount;
            var lobbyist = response.lobbyist;
            if(lobbyist == "null"){
              var lobbyist = ''
            }
            var recipient = response.recipient;
            var date =  response.date;
            var cont_id = response.cont_id;

            var link_to = '/fix_contribution/' + cont_id
            var item = '<tr><td>$' + amount + '</td><td>' + lobbyist + '</td><td>' + recipient + '</td><td>' + date + '</td><td><a class="js-popup" href= "' + link_to + '">Fix</a></td></tr>';
            $('#cont_table').append(item);
            var $cont_recip = $('#cont_recip');
            $cont_recip.select2('data', null);
          }
           
          if (tag == '#giftform'){
            var date = response.date;
            var client = response.client;
            var description = response.description;
            var gift_id = response.gift_id
            var link_to = '/fix_gift/' + gift_id

            var item = '<li>' + description + " from " + client + " on " + date + ' <a class="js-popup pull-right" href= "' + link_to + '">Fix</a></li>'
            $('#gift_basket').append(item);
            var $gift_recip = $('#gift_recip');
            $gift_recip.select2('data', null) 
          }

          if (tag == '#descriptionform'){
            var description = response.description;
            var item =  '<p>Description: ' + description + '</p>';
            $('#discription_list').replaceWith(item);
          }

          if (tag == '#locationform'){
            var location = response.location;
            var item = '<li>' + location + ' added to locations </li>';
            $('#location_list').append(item);
          }
          if (tag == '#recipform'){
            var name = response.name;
            var item = '<p>Added: ' + name + '</p>';
            // I changed the name and moved it:
            $('#recip_list').append(item);
          }
          if (tag == '#regform'){
            var name = response.name;
            var item = '<p>Added: ' + name + '</p>';
            $('#reg_list').append(item);
          }
          if (tag == '#client_infoform'){
            var client_type = response.client_type;
            var description = response.description;
            var client_name = response.client_name;
            var item = '<p>Client name</p>'+ client_name +'<p>Client type: '+ client_type + "</p><p>Description: " + description + '</p>';
            $('#ab_client_info').append(item);
          }

          if (tag == '.deleteable'){
            h.remove();
          }

          if (tag == '#noteform'){
            var note = response.note
            var item = '<div id="note"><p> Note replaced with: ' + note + "</p></div>"
            $('#note').replaceWith(item);
          }

          if (tag == '#mergeform'){
            var note = response.note
            var item = '<li>' + note + "</li>"
            $('#changelist').append(item);
          }
        }
        
        // creates error messages generated in views
        else{
          console.log("error")
          var message = "Error: " + response.error;
          alert(message);
        }  
      },

      // creates error messages 
      error: function( jqxhr, errorText, error){
        var message = "Error: " + error;
        alert(message);
      },
    }
    
    // 1) submit form
    $(tag).ajaxForm(opt);

  };

  update('#stampform');
  update('#terminatedclientform');
  update('#contactform');
  update('#recipform');
  update('#regform');
  update('#payform');
  update('#disform');
  update('#contform');
  update('#giftform');
  update('#descriptionform');
  update('#locationform');
  update('#client_infoform');
  update('#contact_remove_recip');
  update('#contact_remove_lobby');
  update('.deleteable');
  update('#noteform');
  update('#mergeform');

});



// pop ups for fix forms

function popitup(url) {
  newwindow=window.open(url,'name','height=800,width=650');
  if (window.focus) {newwindow.focus()}
  return false;
}
jQuery(document).ready(function() {

  var direct = {
    success: function(response, statusText, xhr, h){
      var error = response.error
      if (typeof error== 'undefined'){
        window.close();
      }
      else{
        console.log("error")
        var message = "Error: " + response.error;
        alert(message);
      }  
    }
  }

$('.fix').ajaxForm(direct);

}); 


