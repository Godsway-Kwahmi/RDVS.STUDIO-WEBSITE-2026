/* Project-page inquiry CTA -- the same mailto hand-off contact.html's inline script performs for its
   form, scoped to the .project-cta-form every project page carries after its prev/next pager. Kept in
   its own file so 223 pages share one wiring instead of 223 inline copies. The deploy is static -- there
   is no server to post to -- so submitting hands the composed inquiry to the visitor's own mail app,
   addressed to the commissions inbox; the form's `action` is the same address, so a visitor with
   JavaScript off still reaches it through the browser's mailto handling. */
(function () {
  var form = document.querySelector('.project-cta-form');
  if (!form) return;
  var sel = form.querySelector('select[name="discipline"]');
  var success = form.querySelector('.project-cta-success');
  var TO = 'info@rdvs.studio';

  /* Exposed on the form so the composed address can be measured without launching a mail client. */
  form.buildUri = function () {
    var val = function (name) { return form.querySelector('[name="' + name + '"]').value.trim(); };
    var picked = sel.selectedIndex > 0 ? sel.options[sel.selectedIndex].text : '';
    var subject = (picked ? picked + ' inquiry' : 'Website inquiry') + ' from ' + val('name');
    var body = val('message') + '\n\n--\n' + val('name') + '\n' + val('email');
    return 'mailto:' + TO
      + '?subject=' + encodeURIComponent(subject)
      + '&body=' + encodeURIComponent(body);
  };

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var uri = form.buildUri();
    if (success) success.style.display = 'block';
    window.location.href = uri;
  });
})();
