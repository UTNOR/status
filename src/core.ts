/**
 * @license MIT
 * Copyright (c) UTNOR and affiliates
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview HTTP Status simulation handler.
 * 
 * Accepts a "status" query parameter and returns a response
 * with the given HTTP status code.
 *
 * @module status
 */
import errResponse from "./err-res";
export default function StatusTool(request: Request) {
  try {
    // Parse request URL
    const url = new URL(request.url);

    // Read "status" query parameter
    const userInputRaw = url.searchParams.get("status");

    // Validate: parameter must exist and not be empty
    if (!userInputRaw || userInputRaw.trim() === "") {
      return new errResponse(
        {
          eName: "EMPTY_REQUEST",
          eMessage: "The request is missing a required 'status' query parameter or its value is empty.",
          eReference: "https://docs.utnor.com/tools/status/errors/EMPTY_REQUEST",
          eRetriable: false,
          eRecoverable: true,
        },
        {
          status: 400
        }
      );
    }

    // Validate: must contain only digits
    if (!/^\d+$/.test(userInputRaw)) {
      return new errResponse(
        {
          eName: "INVALID_TYPE",
          eMessage: "The status must be a numeric integer value.",
          eReference: "https://docs.utnor.com/tools/status/errors/INVALID_TYPE",
          eRetriable: false,
          eRecoverable: true,
        },
        {
          status: 400
        }
      );
    }

    const statusCode = parseInt(userInputRaw, 10);
    const isStatusCode = (statusCode >= 200 && statusCode <= 599);

    // Validate: must be valid HTTP status range
    if (isStatusCode === false) {
      return new errResponse(
        {
          eName: "RANGE_VIOLATION",
          eMessage: "The status code is outside the permitted range.",
          eReference: "https://docs.utnor.com/tools/status/errors/RANGE_VIOLATION",
          eRetriable: false,
          eRecoverable: true,
        }, {
        status: 400
      });
    }

    // Return response with requested status code
    if (isStatusCode) {
      return new Response(null, {
        status: statusCode,
        headers: {
          "Content-Type": "application/json; charset=UTF-8",
          "Access-Control-Allow-Origin": "*",
          "X-Content-Type-Options": "nosniff",
          "X-Frame-Options": "DENY",
          "Content-Security-Policy": "frame-ancestors 'none';",
          "Referrer-Policy": "no-referrer",
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
          "Pragma": "no-cache",
          "Expires": "0",
          "Permissions-Policy": "geolocation=(), microphone=(), camera=()",
          "X-UTNOR-Execution":"success",
          'X-Powered-By': 'UTNOR'
        },
      });
    }


  } catch (_) {
    // Catch unexpected runtime errors
    return new errResponse({
      eName: "UNCAUGHT_RUNTIME_ERROR",
      eMessage: "The request failed due to an unexpected internal runtime error.",
      eReference: "https://docs.utnor.com/tools/status/errors/UNCAUGHT_RUNTIME_ERROR",
      eRetriable: true,
      eRecoverable: false,
    }, {
      status: 500,
      headers: {
        "Connection": "close"
      },
    });
  }
}
