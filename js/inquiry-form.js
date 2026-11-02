/* Project-page inquiry CTA -- AJAX form submission to FormSubmit.co
   wired to projects@rdvs.studio.
   Scoped to .project-cta-form which every project page carries after its prev/next pager.
   Submissions are sent directly via fetch() without opening a mail client.
*/
(function () {
  var form = document.querySelector('.project-cta-form');
  if (!form) return;
  var sel = form.querySelector('select[name="discipline"]');
  var success = form.querySelector('.project-cta-success');
  var submitBtn = form.querySelector('button[type="submit"]');
  var TO = '48e0aa4a66eb4ff68c80d949f8cda072';
  var STUDIO_EMAIL = 'projects@rdvs.studio';

  form.setAttribute('action', 'https://formsubmit.co/' + TO);
  form.setAttribute('method', 'POST');

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var originalBtnText = submitBtn ? submitBtn.textContent : 'Send inquiry';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending inquiry...';
    }

    var val = function (name) {
      var el = form.querySelector('[name="' + name + '"]');
      return el ? el.value.trim() : '';
    };
    var picked = (sel && sel.selectedIndex > 0) ? sel.options[sel.selectedIndex].text : '';
    var name = val('name');
    var email = val('email');
    var message = val('message');
    var pageTitle = document.title ? document.title.split('—')[0].trim() : 'Project Page';
    var subject = 'Project Enquiry: ' + pageTitle + ' (' + (picked || 'General') + ') from ' + name;

    fetch('https://formsubmit.co/ajax/' + TO, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        name: name,
        email: email,
        discipline: picked,
        project: pageTitle,
        url: window.location.href,
        message: message,
        _subject: subject,
        _template: 'table',
        _captcha: 'false'
      })
    })
    .then(function (res) {
      if (!res.ok) throw new Error('Submission failed');
      return res.json();
    })
    .then(function () {
      if (success) {
        success.innerHTML = '<strong>Enquiry sent successfully!</strong> Thank you for reaching out. We will get back to you shortly at <span style="text-decoration: underline;">' + (email || 'your email') + '</span>.';
        success.style.display = 'block';
      }
      form.reset();
    })
    .catch(function () {
      if (success) {
        success.innerHTML = 'Enquiry could not be sent automatically. Please email directly to <a href="mailto:' + STUDIO_EMAIL + '" style="color: var(--foreground);">' + STUDIO_EMAIL + '</a>.';
        success.style.display = 'block';
      }
    })
    .finally(function () {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalBtnText;
      }
    });
  });
})();
