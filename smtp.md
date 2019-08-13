# Send mail via telnet

<pre><code>
$ <b>telnet localhost 25</b>
Trying 127.0.0.1...
Connected to localhost.
Escape character is '^]'.
220 image.localhost ESMTP OpenSMTPD
<b>ehlo rgz.ee</b>
250-image.localhost Hello rgz.ee [127.0.0.1], pleased to meet you
250-8BITMIME
250-ENHANCEDSTATUSCODES
250-SIZE 36700160
250-DSN
250 HELP
<b>mail from:<hi@rgz.ee></b>
250 2.0.0: Ok
<b>rcpt to:<hi@rgz.ee></b>
250 2.1.5 Destination address valid: Recipient ok
<b>data</b>
354 Enter mail, end with "." on a line by itself
<b>to: Roman Zolotarev <hi@rgz.ee></b>
<b>from: Roman Zolotarev <hi@rgz.ee></b>
<b>subject: Hello</b>

<b>World!</b>
<b>.</b>
250 2.0.0: fa2b1400 Message accepted for delivery
<b>quit</b>
221 2.0.0: Bye
Connection closed by foreign host.
$
</code></pre>
