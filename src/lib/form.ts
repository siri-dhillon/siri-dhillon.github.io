/**
 * Form-provider adapters. To switch providers, change `contact.form` in
 * src/data/site.json — no code changes. Every provider here accepts a normal
 * multipart POST, so the form also works without JavaScript.
 */
import type { Site } from './site';

type FormCfg = Site['contact']['form'];

export interface ProviderSetup {
  /** Hidden fields required by the provider. */
  hidden: Record<string, string>;
  /** Name of the honeypot input bots tend to fill in. */
  honeypot: string;
  /** Field name the provider uses for the email subject. */
  subjectField: string;
  /** Field name used for the reply-to address. */
  emailField: string;
}

export function providerSetup(cfg: FormCfg): ProviderSetup {
  switch (cfg.provider) {
    case 'formspree':
      // https://formspree.io — honeypot "_gotcha", subject "_subject"
      return { hidden: {}, honeypot: cfg.honeypotField || '_gotcha', subjectField: '_subject', emailField: 'email' };
    case 'web3forms':
      // https://web3forms.com — needs a public access key; honeypot "botcheck"
      return { hidden: { access_key: cfg.accessKey ?? '' }, honeypot: 'botcheck', subjectField: 'subject', emailField: 'email' };
    case 'getform':
      // https://getform.io — honeypot "_gotcha"
      return { hidden: {}, honeypot: cfg.honeypotField || '_gotcha', subjectField: '_subject', emailField: 'email' };
    case 'custom':
    default:
      // Any endpoint that accepts multipart/form-data and returns 2xx on success
      return { hidden: {}, honeypot: cfg.honeypotField || '_gotcha', subjectField: 'subject', emailField: 'email' };
  }
}

export function isConfigured(cfg: FormCfg): boolean {
  if (/YOUR_FORM_ID|example\.com/i.test(cfg.endpoint)) return false;
  if (cfg.provider === 'web3forms' && !cfg.accessKey) return false;
  return true;
}
