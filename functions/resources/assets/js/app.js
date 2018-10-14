$(document).ready(() => {
  let loader = (param) => {
    // takes param, start or stop
    if (param == "start") {
      $('body').append(`
        <div class="loader">
          <h1 class="brand"><span>So</span>sharu</h1>
          <h5>your request is being processed</h5>
          <div class="prog">
            <div class="res"></div>
          </div>
        </div>
      `);
    }
    if (param == "stop") {
      $('.loader').remove();
    }
  };
  loader('stop');
  // Submit Forms Silently.
  $('.silent-form').each((i, element) => {
    $(element).submit((e) => {
      e.preventDefault();
      loader('start');
      $('input.is-invalid').each((e, input) => {
        $(input).removeClass('is-invalid');
      });

      $('span.is-invalid').each((e, span) => {
        $(span).html('');
      });

      $.ajax({
        type: $(e.target).attr('method'),
        url: $(e.target).attr('action'),
        data: $(e.target).serialize(),
        success: (data) => {
          loader('stop');
          console.log(data);
        },
        error: (data) => {
          loader('stop');
          let errors = data.responseJSON.errors;
          console.log(errors);
          $(errors).each((i, {
            param,
            msg
          }) => {
            // Setting New Messages
            $(`[name=${param}]`).addClass('is-invalid');
            $(`[name=${param}]`).next().html(msg.replace('Error: ', ''));

            // Check for universal errors
            if (param == "error") {
              let error = $(`<div class="alert alert-danger" role="alert"><b>${msg.replace('Error: ', '')}</b></div>`);
              $(".alert-saved").append(error);
              setTimeout(function () {
                $(error).remove();
              }, 2000);
            }
          });
        }
      });
    });
  });
});