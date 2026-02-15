/**
 * @license MIT
 * Copyright (c) UTNOR and affiliates
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview
 * Wraps errors in a standardized JSON response for UTNOR tools.
 * Use this class whenever returning client or server errors.
 *
 * The JSON structure follows the format documented at:
 * https://docs.utnor.com/getting-started/client-error-response-format
 */

type JsonRes = {
  eName: string;
  eMessage: string;
  eReference?: string | null;
  eRetriable?: boolean;
  eRecoverable?: boolean;
};

export default class errorResponse extends Response {
    /**
   * Creates a new JSON error response with standard headers.
   *
   * @param {JsonRes} error - The error details (name, message, reference, retriable/recoverable flags)
   * @param {ResponseInit} [init={}] - Optional ResponseInit for status code, headers, etc.
   * @returns {Response} A Response object ready to return from a fetch handler
   */

  constructor(error: JsonRes, init: ResponseInit = {}) {
        // Set standard/default headers
    const headers = new Headers(init.headers);
    headers.set("Content-Type", "application/json; charset=UTF-8");
    headers.set("X-Content-Type-Options", "nosniff");
    headers.set("Referrer-Policy", "no-referrer");
    headers.set("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0");
    headers.set("Pragma", "no-cache");
    headers.set("Expires", "0");
    headers.set("X-Frame-Options", "DENY");
    headers.set("Cross-Origin-Resource-Policy", "cross-origin");
    headers.set("Access-Control-Allow-Headers","*");
    headers.set("Access-Control-Allow-Origin", "*");
    headers.set("Content-Security-Policy", "frame-ancestors 'none';");
    headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=()");

    const body = [
      {
        tool: "status",
        errors: [
          {
            name: error.eName,
            message: error.eMessage,
            reference: error.eReference ?? null,
            retriable: error.eRetriable ?? false,
            recoverable: error.eRecoverable ?? false,
          },
        ],
        timestamp: new Date().toISOString(),
        docs: "https://docs.utnor.com/",
        signature: "utnor",
      },
    ];

    super(JSON.stringify(body), {
      ...init,
      headers,
    });
  }
}
