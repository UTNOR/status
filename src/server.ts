/**
 * @license MIT
 * Copyright (c) UTNOR and affiliates
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

/**
 * @fileoverview Entry handler for the Utnor's Status Tool.
 */
import errResponse from "./err-res.ts";
import StatusTool from "./core.ts";
import exampleSecurity from "./security.ts";


export default {
    /**
        * Main Fetch handler (Edge/Worker compatible).
        *
        * @param request Incoming HTTP request
        * @returns Response
        */
    async fetch(request: Request) {


        //Performs security and abuse validation on the incoming request.
        const allowed = await exampleSecurity(request)
        if (!allowed) {
            return new errResponse({
                eName: "SECURITY_VIOLATION",
                eMessage: "The request was rejected due to security policy enforcement.",
                eReference: "https://docs.utnor.com/tools/errors/SECURITY_VIOLATION",
                eRetriable: true,
                eRecoverable: false
            },
                {
                    status: 429,
                    headers: {
                        "Retry-After": "3600"
                    }
                }
            );
        }

        const url = new URL(request.url);
        const { method } = request;

        // CORS preflight
        if (method === "OPTIONS") {
            return new Response(null, {
                status: 204,
                headers: {
                    "Access-Control-Allow-Origin": "*",
                    "X-Content-Type-Options": "nosniff",
                    "X-Frame-Options": "DENY",
                    "Content-Security-Policy": "frame-ancestors 'none';",
                    "Referrer-Policy": "no-referrer",
                    "Access-Control-Allow-Methods": "GET, OPTIONS, HEAD",
                    "Access-Control-Max-Age": "86400",
                    "Cache-Control": "public, max-age=86400",
                    "Access-Control-Allow-Headers": "*"
                },
            });
        }

        /*
        * Public route surface.
        */
        if (url.pathname === "/") {
            return StatusTool(request)
        }

        // Fallback: unknown endpoint
        return new errResponse(
            {
                eName: "PAGE_NOT_FOUND",
                eMessage: "The requested endpoint does not exist.",
                eReference: "https://docs.utnor.com/tools/status/errors/PAGE_NOT_FOUND",
                eRetriable: false,
                eRecoverable: true,
            },
            {
                status: 404
            }
        );

    }
};



