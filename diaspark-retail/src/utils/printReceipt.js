export function printReceipt(data, printType = 'Receipt') {
  const { invoiceId, transNo, date, customer, items, payments, taxAmount, totalAmount, salesperson } = data;
  const displayId = transNo || invoiceId || data.special || data.id;

  const safeItems = items || [{ sku: data.item || '', description: data.saleDescription || 'Jewelry, Necklace', qty: 1, price: 0 }];
  const safeCustomer = customer || { 
    customerId: data.customerId, 
    firstName: data.firstName, 
    lastName: data.lastName,
    address: data.address,
    city: data.city,
    state: data.state,
    zip: data.zip,
    phone: data.phone,
    email: data.email
  };
  const safeDate = date || data.orderDate || new Date().toLocaleDateString('en-US');
  const safeSalesperson = salesperson || data.salesPerson || 'Diaspark Admin';

  const subtotal = safeItems.reduce((acc, item) => acc + (parseFloat(item.price || 0) * parseFloat(item.qty || 1)), 0).toFixed(2);
  
  // Try to find electronic # or payment details
  let paymentInfo = '';
  if (payments && payments.length > 0) {
    const payment = payments[0];
    const amount = parseFloat(payment.amount || 0).toFixed(2);
    if (payment.type === 'Credit Card') {
      paymentInfo = `Electronic # : ${payment.transactionNo || '102300000'}, ${safeDate}      $${amount}`;
    } else {
      paymentInfo = `${payment.type} : ${safeDate}      $${amount}`;
    }
  }

  let html = '';

  if (printType === 'Repair Order') {
    const bday = safeCustomer?.birthDate ? safeCustomer.birthDate.replace(/\\//g, '') : '';
    const anniv = safeCustomer?.anniversary ? safeCustomer.anniversary.replace(/\\//g, '') : '';
    const itemDesc = safeItems[0]?.description || 'Jewelry, Necklace';

    html = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Repair Order ${displayId}</title>
        <style>
          @media print {
            @page { margin: 0.5in; }
            body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          }
          body {
            font-family: Arial, sans-serif;
            font-size: 11px;
            color: #000;
            margin: 0;
            padding: 10px;
          }
          .ro-header {
            display: flex;
            justify-content: space-between;
            margin-bottom: 10px;
          }
          .ro-logo {
            border: 2px solid #000;
            width: 300px;
            height: 80px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 48px;
            font-weight: bold;
            color: #ccc;
          }
          .ro-barcode-box {
            text-align: right;
          }
          .ro-barcode {
            font-family: 'Libre Barcode 39', monospace, sans-serif;
            font-size: 50px;
            line-height: 1;
            margin-top: 5px;
          }
          .ro-table {
            width: 100%;
            border-collapse: collapse;
            border: 2px solid #000;
            margin-bottom: 5px;
          }
          .ro-table th, .ro-table td {
            border: 1px solid #000;
            padding: 4px;
            vertical-align: top;
          }
          .label {
            font-size: 9px;
            font-weight: bold;
            text-transform: uppercase;
          }
          .val {
            font-size: 11px;
            margin-top: 2px;
          }
          .t-terms {
            font-size: 9px;
            line-height: 1.2;
            padding: 5px;
            text-align: justify;
          }
          .t-sig {
            margin-top: 15px;
            margin-bottom: 15px;
            font-size: 11px;
          }
        </style>
        <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet">
      </head>
      <body>
        <div class="ro-header">
          <div class="ro-logo">No Logo</div>
          <div class="ro-barcode-box">
            <div style="font-size: 16px;">${displayId}</div>
            <div class="ro-barcode">*${displayId}*</div>
          </div>
        </div>

        <table class="ro-table">
          <tr>
            <td width="20%">
              <div class="label">*CUSTOMER #</div>
              <div class="val">${safeCustomer?.customerId ? 'CUST-' + safeCustomer.customerId : 'DANB-00002'}</div>
            </td>
            <td width="20%">
              <div class="label">*FIRST</div>
              <div class="val">MR. ${safeCustomer?.firstName || ''}</div>
            </td>
            <td width="20%">
              <div class="label">*LAST NAME</div>
              <div class="val">${safeCustomer?.lastName || ''}</div>
            </td>
            <td width="20%">
              <div class="label">*Date REC'D</div>
              <div class="val">${safeDate || ''}</div>
            </td>
            <td width="20%">
              <div class="label">*ASSOCIATE</div>
              <div class="val">${safeSalesperson || 'Diaspark Admin'}</div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="label">*ADDRESS</div>
              <div class="val">${safeCustomer?.address || 'Tillary Court'}</div>
            </td>
            <td>
              <div class="label">APPROX COMPLETION DATE</div>
              <div class="val">06/21/2026</div>
            </td>
            <td>
              <div class="label">*NOTIFIED</div>
              <div class="val">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td>
              <div class="label">*CITY</div>
              <div class="val">${safeCustomer?.city || 'Brooklyn'}</div>
            </td>
            <td>
              <div class="label">*STATE</div>
              <div class="val">${safeCustomer?.state || 'NY'}</div>
            </td>
            <td>
              <div class="label">*ZIP</div>
              <div class="val">${safeCustomer?.zip || '11201'}</div>
            </td>
            <td>
              <div class="label">*PHONE</div>
              <div class="val">${safeCustomer?.phone || '854-750-5554'}</div>
            </td>
            <td>
              <div class="label">* ALT PHONE</div>
              <div class="val">&nbsp;</div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="label">EMAIL</div>
              <div class="val">${safeCustomer?.email || 'daniel.blackman@luxare.com'}</div>
            </td>
            <td style="padding: 0; border: none;">
              <table style="width: 100%; height: 100%; border-collapse: collapse;">
                <tr>
                  <td width="50%" style="border: none; border-right: 1px solid #000; padding: 4px;">
                    <div class="label">B-DAY</div>
                    <div class="val">${bday || '0626'}</div>
                  </td>
                  <td width="50%" style="border: none; padding: 4px;">
                    <div class="label">B-DAY</div>
                    <div class="val">&nbsp;</div>
                  </td>
                </tr>
              </table>
            </td>
            <td style="padding: 0; border: none;">
              <table style="width: 100%; height: 100%; border-collapse: collapse;">
                <tr>
                  <td width="60%" style="border: none; border-right: 1px solid #000; padding: 4px;">
                    <div class="label">ANNIVERSARY</div>
                    <div class="val">${anniv || '0429'}</div>
                  </td>
                  <td width="40%" style="border: none; padding: 4px;">
                    <div class="label" style="font-size:8px;">MAILING LIST<br/>YES NO</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>

        <table class="ro-table">
          <tr>
            <td colspan="3" width="60%">
              <div class="label" style="text-align: center;">*COMPLETE DESCRIPTION OF ARTICLES</div>
              <div class="val" style="margin-top: 10px;">${itemDesc}</div>
            </td>
            <td width="20%">
              <div class="label" style="text-align: center;">DATE OF PURCHASE FROM STORE</div>
            </td>
            <td width="20%">
              <div class="label" style="text-align: center;">DATE OF PREVIOUS REPAIR</div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <span class="label">DESIGNER : </span>
              <span class="val">DAS0001/DIAMOND</span>
            </td>
            <td colspan="2">
              <span class="label">Approx Value : </span>
              <span class="val">1,003,000</span>
            </td>
          </tr>
          <tr>
            <td colspan="5">
              <div class="val">BRAND: DIAMOND CENTER STONE: COLOR: YELLOW, SHAPE: BAGUTTE, TYPE: YELLOW, QTY: 12, MM SIZE: 4, CARAT: 21.00 SIDE STONE 1: COLOR: RED, SHAPE: HEART, TYPE: RED, QTY: 943898, MM SIZE: 1444552, CARAT: 1200.00 SIDE STONE 2: COLOR: BLUE, SHAPE: BAGUTTE, TYPE: PURPLE, QTY: 945, MM SIZE: 9327, CARAT: 4353</div>
            </td>
          </tr>
        </table>

        <table class="ro-table">
          <tr>
            <td colspan="3" width="60%">
              <div class="label">REPAIR WORK REQUESTED :</div>
              <div class="val">JEWELRY REPAIR PARTS</div>
            </td>
            <td width="13%" align="center">
              <div class="label">EST ONLY</div>
              <div class="val">Yes</div>
            </td>
            <td width="13%" align="center">
              <div class="label">PROCEED</div>
            </td>
            <td width="14%" align="center">
              <div class="label">APPRAISE</div>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <div class="val">0.00 To 0.00</div>
            </td>
            <td colspan="2">
              <span class="label">DATE :</span>
            </td>
            <td>
              <span class="label">VENDOR :</span>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <span class="label">ACCEPT</span> &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="label">DECLINE EST</span>
            </td>
            <td colspan="2">
              <span class="label">DATE :</span>
            </td>
            <td>
              <span class="label">PO #: &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; /VENDOR :</span>
            </td>
          </tr>
          <tr>
            <td colspan="3">
              <span class="label">SALES TICKET #:</span>
            </td>
            <td colspan="2">
              <span class="label">DELIVERED BY :</span>
            </td>
            <td>
              <span class="label">VENDOR ETA :</span>
            </td>
          </tr>
          <tr>
            <td colspan="6" class="t-terms">
              The undersigned has read understands and agrees that: The approximate values and description of the items listed are accurate. This store, including its employees, accepts no responsibility for condition or identification of jewelry OR stones upon receipt. All articles of whatever value; and which are antique, irreplaceable or of fragile or brittle natures, are accepted for service on condition that the work to be done will be at the owner's sole risk of damage. Except as otherwise provided herein, responsibility or liability shall be limited to the return of any article(s) listed here on in its resulting condition; or if the article be lost, at sole election, to the payment of the article's valuation as herein determined and limited to replacement with an article(s) as nearly identical as practicable. Except as otherwise provided herein, the liability of for any article described on the reverse side shall not, in any case exceed $500, or such lesser value as may be stated in the service order; or in the event no value is stated on the service order, the value determined by based on the description provided. If no value is listed it will be assumed the value is less than $75.00. If the value of any article(s) is stated on the service order to be higher than $500, such article(s) shall be subject to examination by for their assessment of condition, genuineness and value. Such examination shall not necessarily constitute a complete expert appraisal of such article(s), but shall be a good faith estimation of the value which shall be noted hereon. Actual completion date may be different due to parts availability, shipping delays, repair volume, weather delays, etc and/or any other unforeseen issue that may occur. In no event will be liable for any amount based on a claim that a damaged or lost article had sentimental, keepsake or heirloom value. shall not be responsible or liable in any amount for the loss or theft of any article left in its care for more than 90 days after the customer is notified that service is complete. may deliver possession of any article described to any person presenting the customer's receipt portion of this service order, unless otherwise specifically advised in writing by the customer prior to such delivery. In no event shall have any responsibility or liability for loss of or damage to any article described on the reverse side hereof after such delivery.
              <div class="t-sig">
                CUSTOMER SIGNATURE AT DROP OFF: ______________________________________________________________
              </div>
              <hr style="border-top:1px solid #ccc; margin: 10px 0;"/>
              <div style="margin-top: 10px;">
                The work performed is to my satisfaction and the item(s) are in good working order. Item(s) were received _____with _____ without original claim receipt. I have received and inspected the item(s) listed above.
              </div>
              <div class="t-sig">
                CUSTOMER SIGNATURE AT PICK UP : ______________________________________________________________
              </div>
              <div style="display: flex; justify-content: space-between; margin-top: 20px;">
                <span>DELIVERED BY : ______________________</span>
                <span>DELIVERED DATE : ______________________</span>
                <span>PAID CHARGE : ______________________</span>
              </div>
            </td>
          </tr>
        </table>
        
        <script>
          setTimeout(() => {
            window.print();
            window.onafterprint = function() {};
          }, 500);
        </script>
      </body>
      </html>
    `;
  } else {
    html = `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Receipt ${displayId}</title>
      <style>
        @media print {
          @page { margin: 0.5in; }
          body { -webkit-print-color-adjust: exact; print-color-adjust: exact; }
        }
        body {
          font-family: Arial, sans-serif;
          font-size: 12px;
          color: #000;
          margin: 0;
          padding: 20px;
        }
        .header-section {
          text-align: center;
          margin-bottom: 20px;
          position: relative;
        }
        .logo-box {
          border: 1px solid #000;
          width: 300px;
          height: 100px;
          margin: 0 auto 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #ccc;
          font-size: 48px;
          font-weight: bold;
          background: #f8f8f8;
        }
        .address {
          font-size: 12px;
          margin-bottom: 30px;
        }
        .barcode-section {
          position: absolute;
          top: 0;
          right: 20px;
          text-align: center;
        }
        .barcode {
          font-family: 'Libre Barcode 39', monospace, sans-serif;
          font-size: 40px;
          line-height: 1;
        }
        .info-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 30px;
        }
        .info-box {
          width: 45%;
        }
        .info-title {
          background-color: #0a3a78;
          color: white;
          padding: 4px 8px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .info-content {
          padding: 0 5px;
          line-height: 1.4;
        }
        .item-table {
          width: 100%;
          border-collapse: collapse;
          margin-bottom: 50px;
        }
        .item-table td {
          padding: 8px 5px;
          vertical-align: top;
        }
        .col-sku { width: 15%; }
        .col-code { width: 15%; }
        .col-desc { width: 40%; }
        .col-qty { width: 5%; text-align: center; }
        .col-price { width: 12.5%; text-align: right; }
        .col-ext { width: 12.5%; text-align: right; }
        .sales-rep {
          margin-top: 4px;
          color: #333;
        }
        .footer-section {
          border-top: 4px solid #0a3a78;
          padding-top: 10px;
          width: 100%;
          display: flex;
          justify-content: flex-end;
        }
        .totals-table {
          width: 350px;
        }
        .totals-table td {
          padding: 3px 5px;
          text-align: right;
        }
        .totals-table td:first-child {
          text-align: right;
          padding-right: 20px;
        }
      </style>
      <link href="https://fonts.googleapis.com/css2?family=Libre+Barcode+39&display=swap" rel="stylesheet">
    </head>
    <body>
      <div class="header-section">
        <div class="logo-box">No Logo</div>
        <div class="address">
          200, Metroplex Drive, Edison, NJ 08817 &bull; PH : 732-248-8333 &bull; www.diaspark.com
        </div>
        <div class="barcode-section">
          <div class="barcode">*${displayId}*</div>
          <div>${displayId}</div>
        </div>
      </div>

      <div class="info-section">
        <div class="info-box">
          <div class="info-title">Sold To</div>
          <div class="info-content">
            <div>Customer # : ${safeCustomer?.customerId ? 'CUST-' + safeCustomer.customerId : 'Walk-in'}</div>
            <div>${safeCustomer?.firstName || ''} ${safeCustomer?.lastName || ''}</div>
            <div>${safeCustomer?.address || ''}</div>
            <div>${safeCustomer?.city || ''}, ${safeCustomer?.state || ''}, ${safeCustomer?.zip || ''}</div>
            <div>PH: ${safeCustomer?.phone || ''}</div>
            <div>Email: ${safeCustomer?.email || ''}</div>
          </div>
        </div>
        <div class="info-box">
          <div class="info-title">Sales Information</div>
          <div class="info-content">
            <table style="width: 100%; border: none;">
              <tr><td style="width: 100px;">Receipt #</td><td>: ${displayId}</td></tr>
              <tr><td>Date</td><td>: ${safeDate}</td></tr>
              <tr><td>Store #</td><td>: Edison</td></tr>
              <tr><td>Terminal #</td><td>: POS</td></tr>
              <tr><td>Cashier</td><td>: ${safeSalesperson}</td></tr>
            </table>
          </div>
        </div>
      </div>

      <table class="item-table">
        ${safeItems.map(item => `
          <tr>
            <td class="col-sku">${item.sku?.split(' / ')[0] || item.sku || ''}</td>
            <td class="col-code">${item.sku?.split(' / ')[1] || item.sku || ''}</td>
            <td class="col-desc">
              <div>${item.description || ''}</div>
              <div class="sales-rep">Sales Rep : ${safeSalesperson || 'Admin'}</div>
            </td>
            <td class="col-qty">${item.qty || 1}</td>
            <td class="col-price">$${parseFloat(item.price || 0).toFixed(2)}</td>
            <td class="col-ext">$${(parseFloat(item.price || 0) * parseFloat(item.qty || 1)).toFixed(2)}</td>
          </tr>
        `).join('')}
      </table>

      <div class="footer-section">
        <table class="totals-table">
          <tr>
            <td>Subtotal :</td>
            <td>$${subtotal}</td>
          </tr>
          <tr>
            <td>Tax (6.63%) :</td>
            <td>$${parseFloat(taxAmount || 0).toFixed(2)}</td>
          </tr>
          <tr>
            <td>Net :</td>
            <td>$${parseFloat(totalAmount || 0).toFixed(2)}</td>
          </tr>
          <tr><td colspan="2" style="height: 15px;"></td></tr>
          <tr>
            <td>${paymentInfo.split('      ')[0] || 'Payment : '}</td>
            <td>${paymentInfo.split('      ')[1] || '$0.00'}</td>
          </tr>
          <tr>
            <td>Balance :</td>
            <td>$0.00</td>
          </tr>
        </table>
      </div>
      
      <script>
        // Wait a tiny bit for the barcode font to load before printing
        setTimeout(() => {
          window.print();
          window.onafterprint = function() {
            // Optional cleanup if needed
          };
        }, 500);
      </script>
    </body>
    </html>
    `;
  }

  const iframe = document.createElement('iframe');
  iframe.style.position = 'absolute';
  iframe.style.width = '0px';
  iframe.style.height = '0px';
  iframe.style.border = 'none';
  document.body.appendChild(iframe);
  
  const doc = iframe.contentWindow.document;
  doc.open();
  doc.write(html);
  doc.close();

  // Remove iframe after printing is done
  setTimeout(() => {
    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
  }, 10000); // 10 seconds should be plenty of time to print
}
