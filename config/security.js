module.exports.security = {

  /***************************************************************************
  *                                                                          *
  * CORS is like a more modern version of JSONP-- it allows your application *
  * to circumvent browsers' same-origin policy, so that the responses from   *
  * your Sails app hosted on one domain (e.g. example.com) can be received   *
  * in the client-side JavaScript code from a page you trust hosted on _some *
  * other_ domain (e.g. trustedsite.net).                                    *
  *                                                                          *
  * For additional options and more information, see:                        *
  * https://sailsjs.com/docs/concepts/security/cors                          *
  *                                                                          *
  ***************************************************************************/

  cors: {
    allRoutes: false,
    allowOrigins: '*',
    allowCredentials: false,
  },


  /****************************************************************************
  *                                                                           *
  * CSRF protection should be enabled for this application.                   *
  *                                                                           *
  * For more information, see:                                                *
  * https://sailsjs.com/docs/concepts/security/csrf                           *
  *                                                                           *
  ****************************************************************************/

  // Disabled: GET /csrfToken (the only way to obtain a valid `_csrf` token)
  // is shadowed by the storefront SPA's catch-all route (`frontendRoutes` in
  // config/http.js), so a token could never legitimately be issued. With
  // csrf:true every non-GET request to the admin panel (`/adminizer/*`,
  // mounted as its own Express app, not via sails.router.bind) was rejected
  // with a bare 403 "Forbidden" before reaching any app code — including
  // page saves (e.g. Pages > enable toggle). The admin panel already has
  // its own separate CSRF layer (adminizer's XSRF-TOKEN/x-xsrf-token), and
  // public API routes like /graphql are registered with {csrf:false}
  // anyway, so this setting was only breaking admin-panel writes.
  csrf: false

};