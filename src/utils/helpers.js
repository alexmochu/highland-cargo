// Safely embed a user-supplied value inside a PostgREST or()/and() filter
// string. Values passed to .or() are parsed as filter syntax, so raw
// interpolation lets `,` `(` `)` etc. in user input rewrite the query.
// Wrapping in double quotes (and escaping \ and ") neutralizes that per
// PostgREST's filter grammar: https://postgrest.org/en/stable/references/api/tables_views.html
export const escapeForOrFilter = (value) =>
  `"${String(value).replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;

export const getURL = (path = '') => {
    // Check if NEXT_PUBLIC_SITE_URL is set and non-empty. Set this to your site URL in production env.
    let url =
      process?.env?.NEXT_PUBLIC_SITE_URL &&
      process.env.NEXT_PUBLIC_SITE_URL.trim() !== ''
        ? process.env.NEXT_PUBLIC_SITE_URL
        : // If not set, check for NEXT_PUBLIC_VERCEL_URL, which is automatically set by Vercel.
          process?.env?.NEXT_PUBLIC_VERCEL_URL &&
            process.env.NEXT_PUBLIC_VERCEL_URL.trim() !== ''
          ? process.env.NEXT_PUBLIC_VERCEL_URL
          : // If neither is set, default to localhost for local development.
            'http://localhost:3000/';
  
    // Trim the URL and remove trailing slash if exists.
    url = url.replace(/\/+$/, '');
    // Make sure to include `https://` when not localhost.
    url = url.includes('http') ? url : `https://${url}`;
    // Ensure path starts without a slash to avoid double slashes in the final URL.
    path = path.replace(/^\/+/, '');
  
    // Concatenate the URL and the path.
    return path ? `${url}/${path}` : url;
  };
  
  export const postData = async ({
    url,
    data
  }) => {
    const res = await fetch(url, {
      method: 'POST',
      headers: new Headers({ 'Content-Type': 'application/json' }),
      credentials: 'same-origin',
      body: JSON.stringify(data)
    });
  
    return res.json();
  };
  
  export const toDateTime = (secs) => {
    var t = new Date(+0); // Unix epoch start.
    t.setSeconds(secs);
    return t;
  };
  
  export const calculateTrialEndUnixTimestamp = (
    trialPeriodDays
  ) => {
    // Check if trialPeriodDays is null, undefined, or less than 2 days
    if (
      trialPeriodDays === null ||
      trialPeriodDays === undefined ||
      trialPeriodDays < 2
    ) {
      return undefined;
    }
  
    const currentDate = new Date(); // Current date and time
    const trialEnd = new Date(
      currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000
    ); // Add trial days
    return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
  };
  
  const toastKeyMap = {
    status: ['status', 'status_description'],
    error: ['error', 'error_description']
  };
  
  const getToastRedirect = (
    path,
    toastType,
    toastName,
    toastDescription = '',
    disableButton = false,
    arbitraryParams = ''
  ) => {
    const [nameKey, descriptionKey] = toastKeyMap[toastType];
  
    let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`;
  
    if (toastDescription) {
      redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`;
    }
  
    if (disableButton) {
      redirectPath += `&disable_button=true`;
    }
  
    if (arbitraryParams) {
      redirectPath += `&${arbitraryParams}`;
    }
  
    return redirectPath;
  };
  
  export const getStatusRedirect = (
    path,
    statusName,
    statusDescription = '',
    disableButton = false,
    arbitraryParams = ''
  ) =>
    getToastRedirect(
      path,
      'status',
      statusName,
      statusDescription,
      disableButton,
      arbitraryParams
    );
  
  export const getErrorRedirect = (
    path,
    errorName,
    errorDescription = '',
    disableButton = false,
    arbitraryParams = ''
  ) =>
    getToastRedirect(
      path,
      'error',
      errorName,
      errorDescription,
      disableButton,
      arbitraryParams
    );