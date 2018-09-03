var isoCountries = {
    'AF' : 'Afghanistan',
    'AX' : 'Aland Islands',
    'AL' : 'Albania',
    'DZ' : 'Algeria',
    'AS' : 'American Samoa',
    'AD' : 'Andorra',
    'AO' : 'Angola',
    'AI' : 'Anguilla',
    'AQ' : 'Antarctica',
    'AG' : 'Antigua And Barbuda',
    'AR' : 'Argentina',
    'AM' : 'Armenia',
    'AW' : 'Aruba',
    'AU' : 'Australia',
    'AT' : 'Austria',
    'AZ' : 'Azerbaijan',
    'BS' : 'Bahamas',
    'BH' : 'Bahrain',
    'BD' : 'Bangladesh',
    'BB' : 'Barbados',
    'BY' : 'Belarus',
    'BE' : 'Belgium',
    'BZ' : 'Belize',
    'BJ' : 'Benin',
    'BM' : 'Bermuda',
    'BT' : 'Bhutan',
    'BO' : 'Bolivia',
    'BA' : 'Bosnia And Herzegovina',
    'BW' : 'Botswana',
    'BV' : 'Bouvet Island',
    'BR' : 'Brazil',
    'IO' : 'British Indian Ocean Territory',
    'BN' : 'Brunei Darussalam',
    'BG' : 'Bulgaria',
    'BF' : 'Burkina Faso',
    'BI' : 'Burundi',
    'KH' : 'Cambodia',
    'CM' : 'Cameroon',
    'CA' : 'Canada',
    'CV' : 'Cape Verde',
    'KY' : 'Cayman Islands',
    'CF' : 'Central African Republic',
    'TD' : 'Chad',
    'CL' : 'Chile',
    'CN' : 'China',
    'CX' : 'Christmas Island',
    'CC' : 'Cocos (Keeling) Islands',
    'CO' : 'Colombia',
    'KM' : 'Comoros',
    'CG' : 'Congo',
    'CD' : 'Congo, Democratic Republic',
    'CK' : 'Cook Islands',
    'CR' : 'Costa Rica',
    'CI' : 'Cote D\'Ivoire',
    'HR' : 'Croatia',
    'CU' : 'Cuba',
    'CY' : 'Cyprus',
    'CZ' : 'Czech Republic',
    'DK' : 'Denmark',
    'DJ' : 'Djibouti',
    'DM' : 'Dominica',
    'DO' : 'Dominican Republic',
    'EC' : 'Ecuador',
    'EG' : 'Egypt',
    'SV' : 'El Salvador',
    'GQ' : 'Equatorial Guinea',
    'ER' : 'Eritrea',
    'EE' : 'Estonia',
    'ET' : 'Ethiopia',
    'FK' : 'Falkland Islands (Malvinas)',
    'FO' : 'Faroe Islands',
    'FJ' : 'Fiji',
    'FI' : 'Finland',
    'FR' : 'France',
    'GF' : 'French Guiana',
    'PF' : 'French Polynesia',
    'TF' : 'French Southern Territories',
    'GA' : 'Gabon',
    'GM' : 'Gambia',
    'GE' : 'Georgia',
    'DE' : 'Germany',
    'GH' : 'Ghana',
    'GI' : 'Gibraltar',
    'GR' : 'Greece',
    'GL' : 'Greenland',
    'GD' : 'Grenada',
    'GP' : 'Guadeloupe',
    'GU' : 'Guam',
    'GT' : 'Guatemala',
    'GG' : 'Guernsey',
    'GN' : 'Guinea',
    'GW' : 'Guinea-Bissau',
    'GY' : 'Guyana',
    'HT' : 'Haiti',
    'HM' : 'Heard Island & Mcdonald Islands',
    'VA' : 'Holy See (Vatican City State)',
    'HN' : 'Honduras',
    'HK' : 'Hong Kong',
    'HU' : 'Hungary',
    'IS' : 'Iceland',
    'IN' : 'India',
    'ID' : 'Indonesia',
    'IR' : 'Iran, Islamic Republic Of',
    'IQ' : 'Iraq',
    'IE' : 'Ireland',
    'IM' : 'Isle Of Man',
    'IL' : 'Israel',
    'IT' : 'Italy',
    'JM' : 'Jamaica',
    'JP' : 'Japan',
    'JE' : 'Jersey',
    'JO' : 'Jordan',
    'KZ' : 'Kazakhstan',
    'KE' : 'Kenya',
    'KI' : 'Kiribati',
    'KR' : 'Korea',
    'KW' : 'Kuwait',
    'KG' : 'Kyrgyzstan',
    'LA' : 'Lao People\'s Democratic Republic',
    'LV' : 'Latvia',
    'LB' : 'Lebanon',
    'LS' : 'Lesotho',
    'LR' : 'Liberia',
    'LY' : 'Libyan Arab Jamahiriya',
    'LI' : 'Liechtenstein',
    'LT' : 'Lithuania',
    'LU' : 'Luxembourg',
    'MO' : 'Macao',
    'MK' : 'Macedonia',
    'MG' : 'Madagascar',
    'MW' : 'Malawi',
    'MY' : 'Malaysia',
    'MV' : 'Maldives',
    'ML' : 'Mali',
    'MT' : 'Malta',
    'MH' : 'Marshall Islands',
    'MQ' : 'Martinique',
    'MR' : 'Mauritania',
    'MU' : 'Mauritius',
    'YT' : 'Mayotte',
    'MX' : 'Mexico',
    'FM' : 'Micronesia, Federated States Of',
    'MD' : 'Moldova',
    'MC' : 'Monaco',
    'MN' : 'Mongolia',
    'ME' : 'Montenegro',
    'MS' : 'Montserrat',
    'MA' : 'Morocco',
    'MZ' : 'Mozambique',
    'MM' : 'Myanmar',
    'NA' : 'Namibia',
    'NR' : 'Nauru',
    'NP' : 'Nepal',
    'NL' : 'Netherlands',
    'AN' : 'Netherlands Antilles',
    'NC' : 'New Caledonia',
    'NZ' : 'New Zealand',
    'NI' : 'Nicaragua',
    'NE' : 'Niger',
    'NG' : 'Nigeria',
    'NU' : 'Niue',
    'NF' : 'Norfolk Island',
    'MP' : 'Northern Mariana Islands',
    'NO' : 'Norway',
    'OM' : 'Oman',
    'PK' : 'Pakistan',
    'PW' : 'Palau',
    'PS' : 'Palestinian Territory, Occupied',
    'PA' : 'Panama',
    'PG' : 'Papua New Guinea',
    'PY' : 'Paraguay',
    'PE' : 'Peru',
    'PH' : 'Philippines',
    'PN' : 'Pitcairn',
    'PL' : 'Poland',
    'PT' : 'Portugal',
    'PR' : 'Puerto Rico',
    'QA' : 'Qatar',
    'RE' : 'Reunion',
    'RO' : 'Romania',
    'RU' : 'Russian Federation',
    'RW' : 'Rwanda',
    'BL' : 'Saint Barthelemy',
    'SH' : 'Saint Helena',
    'KN' : 'Saint Kitts And Nevis',
    'LC' : 'Saint Lucia',
    'MF' : 'Saint Martin',
    'PM' : 'Saint Pierre And Miquelon',
    'VC' : 'Saint Vincent And Grenadines',
    'WS' : 'Samoa',
    'SM' : 'San Marino',
    'ST' : 'Sao Tome And Principe',
    'SA' : 'Saudi Arabia',
    'SN' : 'Senegal',
    'RS' : 'Serbia',
    'SC' : 'Seychelles',
    'SL' : 'Sierra Leone',
    'SG' : 'Singapore',
    'SK' : 'Slovakia',
    'SI' : 'Slovenia',
    'SB' : 'Solomon Islands',
    'SO' : 'Somalia',
    'ZA' : 'South Africa',
    'GS' : 'South Georgia And Sandwich Isl.',
    'ES' : 'Spain',
    'LK' : 'Sri Lanka',
    'SD' : 'Sudan',
    'SR' : 'Suriname',
    'SJ' : 'Svalbard And Jan Mayen',
    'SZ' : 'Swaziland',
    'SE' : 'Sweden',
    'CH' : 'Switzerland',
    'SY' : 'Syrian Arab Republic',
    'TW' : 'Taiwan',
    'TJ' : 'Tajikistan',
    'TZ' : 'Tanzania',
    'TH' : 'Thailand',
    'TL' : 'Timor-Leste',
    'TG' : 'Togo',
    'TK' : 'Tokelau',
    'TO' : 'Tonga',
    'TT' : 'Trinidad And Tobago',
    'TN' : 'Tunisia',
    'TR' : 'Turkey',
    'TM' : 'Turkmenistan',
    'TC' : 'Turks And Caicos Islands',
    'TV' : 'Tuvalu',
    'UG' : 'Uganda',
    'UA' : 'Ukraine',
    'AE' : 'United Arab Emirates',
    'GB' : 'United Kingdom',
    'US' : 'United States',
    'UM' : 'United States Outlying Islands',
    'UY' : 'Uruguay',
    'UZ' : 'Uzbekistan',
    'VU' : 'Vanuatu',
    'VE' : 'Venezuela',
    'VN' : 'Viet Nam',
    'VG' : 'Virgin Islands, British',
    'VI' : 'Virgin Islands, U.S.',
    'WF' : 'Wallis And Futuna',
    'EH' : 'Western Sahara',
    'YE' : 'Yemen',
    'ZM' : 'Zambia',
    'ZW' : 'Zimbabwe'
};

let dataGlobal;
$(document).ready(function(){

  ajaxForProfile();

     $(".nav-tabs li").click(function() {

         $(".nav-tabs li").removeClass("active");
         $(this).addClass("active");

         switch($(this).attr("id")) {
             case "profile_tab":
                 ajaxForProfile();
                 break;
             case "activities_tab":
                 ajaxForActivitiesInfo();
                 break;
             case "bookmarks_tab":
                  ajaxForBookmarks();
                  break;
         }
     });


});



function ajaxForProfile(){
  // if(getCookie('u-auth')){

    let username = findGetParameter("username");

    if (!username) {
      username = getCookie("u-auth")
    }
    $.ajax({
         type: 'GET',
         url:'/profile/'+ username,
         success: function(data , textStatus, request){
           dataGlobal = data;
           renderProfileInfoForOther(data.user);
           if(data.isItMe){
            $("#chat_link").hide();
              // renderProfileInfo(data.user);
            $("#edit_profile_button").removeClass("hidden");
            $("#edit_profile_button").on("click", editProfileOnclickHandler);
           }
         }
       });
  // }

}

function ajaxForBookmarks(){

  let username = findGetParameter("username");

  if (!username) {
    username = getCookie("u-auth")
  }
  $.ajax({
       type: 'GET',
       url:'/api/getmybookmarkedthreads/'+ username,
       success: function(data , textStatus, request){
         renderThreads(data);
       }
     });

     $.ajax({
          type: 'GET',
          url:'/api/getmybookmarkedreplies/'+ username,
          success: function(data , textStatus, request){
            renderReplies(data);
          }
        });

}

let saveProfileEventHandler = function() {

  let data = {
    myFullName: $('#fullname').val(),
    aboutMe: $('#about').val(),
    myLocation: $("#location option:selected").val(),
    myUniversity: $('#university').val(),
    myMajor: $('#major').val(),
    mySpecialisation: $('#specialisation').val()
  };
  $.ajax({
       type: 'POST',
       data: data,
       datatype: 'json',
       url:'/profile/save',
       success: function(data , textStatus, request){
         alert('Profile updated Successfully');
       },
       error: function(res) {
        alert("Error Occured");
       },
       complete: function() {
        window.location.reload();
       }
     });
}

let editProfileOnclickHandler = function() {
  renderProfileInfo(dataGlobal.user)
}

function renderProfileInfo(data){
    $("#container").html('');
    let profileTemplate = $("#profile_details").html();
    let avatarFileName;
    if (data.avatar) {
      avatarFileName = "/uploads/" + data.avatar;
    } else {
      avatarFileName = "assets/images/avatar.png";
    }

    let countryName = getCountryName(data.location);
    let currentTime = new Date();
    let year = currentTime.getFullYear();
    let formattedTime;
    if(year == moment(data.userCreatedAt).year()){
      formattedTime = moment(data.userCreatedAt).format('HH:mm on DD-MMM');
    }else{
      formattedTime = moment(data.userCreatedAt).format('HH:mm on DD-MMM-YYYY ');
    }
    let renderedTemplate = Mustache.render(profileTemplate,{
        email: data.email,
        name: data.username,
        fullname: data.fullName,
        type: data.typeOfUser,
        about: data.about,
        location: countryName,
        votes: data.votes,
        posts: data.posts,
        createdAt: formattedTime,
        university: data.university,
        major:data.major,
        specialisation: data.specialisation,
        avatar: avatarFileName

    });
    $("#container").append(renderedTemplate);
    $("#location").val(data.location).change();
    $("#upload_button").click(function() {
    	uploadFile();
    });


    function uploadFile() {
    	let formData = new FormData();
    	formData.append("myimage",$('input[type=file]')[0].files[0]);

    	$.ajax({
        url: '/avatarupload',
        data: formData,
        type: 'POST',
        contentType: false,
        processData: false,
        success: function(res) {
        	console.log(res)
          location.reload();
        },
        error: function(res) {
        	alert("error");
        }
    });

    }
    $('#edit_password').on('click', () =>{
      $('#edit_password').fadeOut('fast');
      $('.edit_password_div').fadeIn('slow');

    })

    $('#edit_password_done').on('click', () =>{
      // $(this).fadeOut('slow');

      let old_password = $("#old_password").val();
      let new_password = $("#new_password").val();
      let confirm_password = $("#confirm_password").val();

      if (old_password === "" || new_password === "") {
        alert("Please fill all the fields");
        return;
      } else if(new_password.length < 8) {
        alert("New password must be 8 characters long");
        return;
      } else if (new_password !== confirm_password) {
        alert("New password and confirm password do not match");
        return;
      }

      let data = {
        oldpassword: old_password,
        newpassword: new_password
      }

      $.ajax({
        url: "/api/changepassword",
        type: "post",
        contentType: "application/json",
        data: JSON.stringify(data),
        success: (res) => {
          $('.edit_password_div').fadeOut('slow');
          $('#edit_password').fadeIn('slow')
          alert("Password changed successfully");
        },
        error: () => {
          alert("Old password is wrong");
        }
      })


    })

    $('#save_profile').on('click', saveProfileEventHandler);

}

function renderProfileInfoForOther(data){
    $("#container").html('');
    let profileForOtherTemplate = $("#profile_details_other").html();

    let avatarFileName;
    if (data.avatar) {
      avatarFileName = "/uploads/" + data.avatar;
    } else {
      avatarFileName = "assets/images/avatar.png";
    }
    let countryName = getCountryName(data.location);
    let currentTime = new Date();
    let year = currentTime.getFullYear();
    let formattedTime;
    if(year == moment(data.userCreatedAt).year()){
      formattedTime = moment(data.userCreatedAt).format('HH:mm on DD-MMM');
    }else{
      formattedTime = moment(data.userCreatedAt).format('HH:mm on DD-MMM-YYYY ');
    }


    let renderedTemplate = Mustache.render(profileForOtherTemplate,{
        email: data.email,
        name: data.username,
        fullname: data.fullName,
        type: data.typeOfUser,
        about: data.about,
        location: countryName,
        votes: data.votes,
        posts: data.posts,
        createdAt: formattedTime,
        university: data.university,
        major:data.major,
        specialisation: data.specialisation,
        avatar: avatarFileName

    });
    $("#container").append(renderedTemplate);



    $("#chat_link").attr("href","/user/chat?open_chat="+data.username);

}

function ajaxForActivitiesInfo(data){
  let username = findGetParameter("username");

  if (!username) {
    username = getCookie("u-auth")
  }
  $.ajax({
       type: 'GET',
       url:'/api/getmythreads/'+ username,
       success: function(data , textStatus, request){
         renderThreads(data);
       }
     });

    $.ajax({
          type: 'GET',
          url:'/api/getmyreplies/'+ username,
          success: function(data , textStatus, request){
            renderReplies(data);
          }
        });

      $.ajax({
             type: 'GET',
             url:'/api/getmytags/'+ username,
             success: function(data , textStatus, request){
               renderTags(data);
             }
           });


}

function renderThreads(threads){

    $("#container").html('');
    let activitiesTemplate = $("#thread_details").html();
    let currentTime = new Date();
    let year = currentTime.getFullYear();
    let formattedTime;
    threads.forEach((thread) =>{
      if(year == moment(thread.createdAt).year()){
        thread.createdAt = moment(thread.createdAt).format('HH:mm on DD-MMM');
      }else{
        thread.createdAt = moment(thread.createdAt).format('HH:mm on DD-MMM-YYYY ');
      }
    })
    let renderedTemplate = Mustache.render(activitiesTemplate, {threads: threads});
    $("#container").append(renderedTemplate);

}

function renderReplies(replies){

    let activitiesTemplate = $("#reply_details").html();
    let currentTime = new Date();
    let year = currentTime.getFullYear();
    let formattedTime;
    replies.forEach((reply) =>{
      if(year == moment(reply.createdAt).year()){
        reply.createdAt = moment(reply.createdAt).format('HH:mm on DD-MMM');
      }else{
        reply.createdAt = moment(reply.createdAt).format('HH:mm on DD-MMM-YYYY ');
      }
    })
    let renderedTemplate = Mustache.render(activitiesTemplate, {replies: replies});
    $("#container").append(renderedTemplate);

}

function renderTags(tags){

    let activitiesTemplate = $("#tags_details").html();
    let renderedTemplate = Mustache.render(activitiesTemplate, {tags: tags});
    $("#container").append(renderedTemplate);

}

function getCookie(name) {
  var value = "; " + document.cookie;
  var parts = value.split("; " + name + "=");
  if (parts.length == 2) return parts.pop().split(";").shift();
}

function getCountryName (countryCode) {
    if (isoCountries.hasOwnProperty(countryCode)) {
        return isoCountries[countryCode];
    } else {
        return countryCode;
    }
}
