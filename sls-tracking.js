(() => {
  'use strict';

  const project = 'visit-stats';
  const endpoint = 'cn-hangzhou.log.aliyuncs.com';
  const logstore = 'full-stack-learning-plan';
  const trackUrl = `https://${project}.${endpoint}/logstores/${logstore}/track?APIVersion=0.6.0`;
  const visitorStorageKey = 'sls_visitor_id';
  const sessionStorageKey = 'sls_session_id';

  const hostname = window.location.hostname;
  if (hostname === 'localhost' || hostname === '127.0.0.1' || hostname === '::1') {
    return;
  }

  const createId = (prefix) => {
    const uuid = window.crypto && typeof window.crypto.randomUUID === 'function'
      ? window.crypto.randomUUID()
      : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    return `${prefix}_${uuid}`;
  };

  const readId = (getStorage, key, prefix) => {
    try {
      const storage = getStorage();
      const existing = storage.getItem(key);
      if (existing) {
        return existing;
      }
      const created = createId(prefix);
      storage.setItem(key, created);
      return created;
    } catch (error) {
      return createId(prefix);
    }
  };

  const userAgent = navigator.userAgent || '';
  const isIPad = /ipad/i.test(userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

  const detectDevice = () => {
    if (!userAgent) {
      return 'unknown';
    }
    if (/bot|crawler|spider|slurp|bingpreview|facebookexternalhit|headlesschrome|phantomjs|lighthouse|pagespeed/i.test(userAgent)) {
      return 'bot';
    }
    if (isIPad || /tablet|playbook|silk/i.test(userAgent) || (/android/i.test(userAgent) && !/mobile/i.test(userAgent))) {
      return 'tablet';
    }
    if (/mobi|iphone|ipod|android|windows phone|blackberry|opera mini|iemobile/i.test(userAgent)) {
      return 'mobile';
    }
    return 'desktop';
  };

  const detectOs = () => {
    if (/windows/i.test(userAgent)) {
      return 'Windows';
    }
    if (/iphone|ipad|ipod/i.test(userAgent) || isIPad) {
      return 'iOS';
    }
    if (/android/i.test(userAgent)) {
      return 'Android';
    }
    if (/mac os x|macintosh/i.test(userAgent)) {
      return 'macOS';
    }
    if (/linux/i.test(userAgent)) {
      return 'Linux';
    }
    return 'Other';
  };

  const detectBrowser = () => {
    if (/micromessenger/i.test(userAgent)) {
      return 'WeChat';
    }
    if (/qqbrowser|qq\//i.test(userAgent)) {
      return 'QQBrowser';
    }
    if (/ucbrowser/i.test(userAgent)) {
      return 'UCBrowser';
    }
    if (/edg\//i.test(userAgent)) {
      return 'Edge';
    }
    if (/opr\//i.test(userAgent)) {
      return 'Opera';
    }
    if (/firefox\//i.test(userAgent)) {
      return 'Firefox';
    }
    if (/chrome\//i.test(userAgent)) {
      return 'Chrome';
    }
    if (/safari\//i.test(userAgent)) {
      return 'Safari';
    }
    return 'Other';
  };

  const params = new URLSearchParams(window.location.search);
  const visitorId = readId(() => window.localStorage, visitorStorageKey, 'v');
  const sessionId = readId(() => window.sessionStorage, sessionStorageKey, 's');
  const payload = {
    __time__: Math.floor(Date.now() / 1000),
    __topic__: 'page_view',
    __source__: window.location.host,
    event_type: 'page_view',
    host: window.location.host,
    page_path: window.location.pathname,
    page_url: window.location.href,
    page_title: document.title,
    referrer: document.referrer,
    device_type: detectDevice(),
    os: detectOs(),
    browser: detectBrowser(),
    user_agent: userAgent,
    visitor_id: visitorId,
    session_id: sessionId,
    screen_width: window.screen ? window.screen.width : 0,
    screen_height: window.screen ? window.screen.height : 0,
    language: navigator.language || '',
    utm_source: params.get('utm_source') || '',
    utm_medium: params.get('utm_medium') || '',
    utm_campaign: params.get('utm_campaign') || '',
  };
  const body = JSON.stringify(payload);

  const send = () => {
    if (typeof window.fetch === 'function') {
      window.fetch(trackUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body,
        keepalive: true,
        credentials: 'omit',
      }).catch(() => {});
      return;
    }
    if (typeof navigator.sendBeacon === 'function') {
      navigator.sendBeacon(trackUrl, new Blob([body], { type: 'application/json' }));
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', send, { once: true });
  } else {
    send();
  }
})();
