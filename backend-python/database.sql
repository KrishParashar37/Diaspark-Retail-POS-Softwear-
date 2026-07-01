BEGIN TRANSACTION;
CREATE TABLE Customers (
            customerId INTEGER PRIMARY KEY AUTOINCREMENT,
            firstName TEXT,
            lastName TEXT,
            email TEXT,
            mobile TEXT,
            city TEXT,
            stateName TEXT,
            zipCode TEXT,
            addressLine TEXT
        );
INSERT INTO "Customers" VALUES(1,'John','Doe','john.doe@example.com','555-0101','New York','NY','10001','123 Broadway');
INSERT INTO "Customers" VALUES(2,'Jane','Smith','jane.smith@example.com','555-0102','Los Angeles','CA','90001','456 Hollywood Blvd');
INSERT INTO "Customers" VALUES(3,'Michael','Johnson','mike.j@example.com','555-0103','Chicago','IL','60601','789 Wacker Dr');
INSERT INTO "Customers" VALUES(4,'Emily','Davis','emily.d@example.com','555-0104','Houston','TX','77001','321 Main St');
INSERT INTO "Customers" VALUES(5,'David','Brown','david.b@example.com','555-0105','Phoenix','AZ','85001','654 Desert Way');
INSERT INTO "Customers" VALUES(6,'Sarah','Wilson','sarah.w@example.com','555-0106','Philadelphia','PA','19101','987 Liberty Ave');
INSERT INTO "Customers" VALUES(7,'James','Moore','james.m@example.com','555-0107','San Antonio','TX','78201','147 Alamo St');
INSERT INTO "Customers" VALUES(8,'Jessica','Taylor','jessica.t@example.com','555-0108','San Diego','CA','92101','258 Ocean Blvd');
INSERT INTO "Customers" VALUES(9,'William','Anderson','william.a@example.com','555-0109','Dallas','TX','75201','369 Texas Ave');
INSERT INTO "Customers" VALUES(10,'Ashley','Thomas','ashley.t@example.com','555-0110','San Jose','CA','95101','159 Tech Blvd');
INSERT INTO "Customers" VALUES(11,'Robert','Jackson','robert.j@example.com','555-0111','Austin','TX','73301','753 Music Ave');
INSERT INTO "Customers" VALUES(12,'Jennifer','White','jennifer.w@example.com','555-0112','Jacksonville','FL','32099','951 Beach Rd');
INSERT INTO "Customers" VALUES(13,'Richard','Harris','richard.h@example.com','555-0113','Fort Worth','TX','76101','357 Cowboy Way');
INSERT INTO "Customers" VALUES(14,'Lisa','Martin','lisa.m@example.com','555-0114','Columbus','OH','43201','456 Buckeye Cir');
INSERT INTO "Customers" VALUES(15,'Charles','Thompson','charles.t@example.com','555-0115','Charlotte','NC','28201','789 Queen City Dr');
CREATE TABLE Orders (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            orderType TEXT,
            special TEXT,
            lastName TEXT,
            firstName TEXT,
            orderDate TEXT,
            estYear TEXT,
            shipDate TEXT,
            cf TEXT,
            ack TEXT,
            esti TEXT,
            po TEXT,
            cnt TEXT,
            rec TEXT,
            st TEXT,
            co TEXT,
            salesPerson TEXT,
            rush TEXT,
            workbag TEXT,
            currentStage TEXT,
            stageDueDate TEXT,
            vendor TEXT,
            customerConfi TEXT,
            item TEXT,
            name TEXT,
            saleDescription TEXT
        );
INSERT INTO "Orders" VALUES(1,'Special Order','102946-101-0','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(2,'Special Order','102914-101-0','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(3,'Repair Order','102920-101-0','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(4,'Repair Order','102913-101-0','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(5,'Layaway Order','102908-101-0','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(6,'Layaway Order','102910-101-0','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(7,'Layaway Order','102912-101-0','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(8,'Custom Order','102959-101-0','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(9,'Custom Order','102993-101-0','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(10,'Special Order','103021-101-0','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(11,'Special Order','103007-101-0','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(12,'Special Order','102946-101-1','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(13,'Special Order','102914-101-1','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(14,'Repair Order','102920-101-1','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(15,'Repair Order','102913-101-1','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(16,'Layaway Order','102908-101-1','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(17,'Layaway Order','102910-101-1','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(18,'Layaway Order','102912-101-1','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(19,'Custom Order','102959-101-1','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(20,'Custom Order','102993-101-1','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(21,'Special Order','103021-101-1','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(22,'Special Order','103007-101-1','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(23,'Special Order','102946-101-2','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(24,'Special Order','102914-101-2','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(25,'Repair Order','102920-101-2','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(26,'Repair Order','102913-101-2','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(27,'Layaway Order','102908-101-2','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(28,'Layaway Order','102910-101-2','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(29,'Layaway Order','102912-101-2','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(30,'Custom Order','102959-101-2','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(31,'Custom Order','102993-101-2','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(32,'Special Order','103021-101-2','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(33,'Special Order','103007-101-2','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(34,'Special Order','102946-101-3','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(35,'Special Order','102914-101-3','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(36,'Repair Order','102920-101-3','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(37,'Repair Order','102913-101-3','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(38,'Layaway Order','102908-101-3','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(39,'Layaway Order','102910-101-3','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(40,'Layaway Order','102912-101-3','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(41,'Custom Order','102959-101-3','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(42,'Custom Order','102993-101-3','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(43,'Special Order','103021-101-3','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(44,'Special Order','103007-101-3','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(45,'Special Order','102946-101-4','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(46,'Special Order','102914-101-4','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(47,'Repair Order','102920-101-4','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(48,'Repair Order','102913-101-4','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(49,'Layaway Order','102908-101-4','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(50,'Layaway Order','102910-101-4','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(51,'Layaway Order','102912-101-4','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(52,'Custom Order','102959-101-4','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(53,'Custom Order','102993-101-4','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(54,'Special Order','103021-101-4','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(55,'Special Order','103007-101-4','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(56,'Special Order','102946-101-5','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(57,'Special Order','102914-101-5','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(58,'Repair Order','102920-101-5','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(59,'Repair Order','102913-101-5','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(60,'Layaway Order','102908-101-5','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(61,'Layaway Order','102910-101-5','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(62,'Layaway Order','102912-101-5','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(63,'Custom Order','102959-101-5','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(64,'Custom Order','102993-101-5','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(65,'Special Order','103021-101-5','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(66,'Special Order','103007-101-5','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(67,'Special Order','102946-101-6','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(68,'Special Order','102914-101-6','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(69,'Repair Order','102920-101-6','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(70,'Repair Order','102913-101-6','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(71,'Layaway Order','102908-101-6','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(72,'Layaway Order','102910-101-6','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(73,'Layaway Order','102912-101-6','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(74,'Custom Order','102959-101-6','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(75,'Custom Order','102993-101-6','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(76,'Special Order','103021-101-6','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(77,'Special Order','103007-101-6','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(78,'Special Order','102946-101-7','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(79,'Special Order','102914-101-7','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(80,'Repair Order','102920-101-7','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(81,'Repair Order','102913-101-7','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(82,'Layaway Order','102908-101-7','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(83,'Layaway Order','102910-101-7','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(84,'Layaway Order','102912-101-7','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(85,'Custom Order','102959-101-7','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(86,'Custom Order','102993-101-7','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(87,'Special Order','103021-101-7','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(88,'Special Order','103007-101-7','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(89,'Special Order','102946-101-8','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(90,'Special Order','102914-101-8','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(91,'Repair Order','102920-101-8','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(92,'Repair Order','102913-101-8','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(93,'Layaway Order','102908-101-8','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(94,'Layaway Order','102910-101-8','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(95,'Layaway Order','102912-101-8','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(96,'Custom Order','102959-101-8','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(97,'Custom Order','102993-101-8','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(98,'Special Order','103021-101-8','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(99,'Special Order','103007-101-8','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(100,'Special Order','102946-101-9','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(101,'Special Order','102914-101-9','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(102,'Repair Order','102920-101-9','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(103,'Repair Order','102913-101-9','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(104,'Layaway Order','102908-101-9','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(105,'Layaway Order','102910-101-9','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(106,'Layaway Order','102912-101-9','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(107,'Custom Order','102959-101-9','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(108,'Custom Order','102993-101-9','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(109,'Special Order','103021-101-9','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(110,'Special Order','103007-101-9','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(111,'Special Order','102946-101-10','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(112,'Special Order','102914-101-10','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(113,'Repair Order','102920-101-10','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(114,'Repair Order','102913-101-10','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(115,'Layaway Order','102908-101-10','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(116,'Layaway Order','102910-101-10','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(117,'Layaway Order','102912-101-10','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(118,'Custom Order','102959-101-10','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(119,'Custom Order','102993-101-10','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(120,'Special Order','103021-101-10','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(121,'Special Order','103007-101-10','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(122,'Special Order','102946-101-11','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(123,'Special Order','102914-101-11','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(124,'Repair Order','102920-101-11','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(125,'Repair Order','102913-101-11','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(126,'Layaway Order','102908-101-11','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(127,'Layaway Order','102910-101-11','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(128,'Layaway Order','102912-101-11','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(129,'Custom Order','102959-101-11','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(130,'Custom Order','102993-101-11','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(131,'Special Order','103021-101-11','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(132,'Special Order','103007-101-11','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(133,'Special Order','102946-101-12','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(134,'Special Order','102914-101-12','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(135,'Repair Order','102920-101-12','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(136,'Repair Order','102913-101-12','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(137,'Layaway Order','102908-101-12','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(138,'Layaway Order','102910-101-12','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(139,'Layaway Order','102912-101-12','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(140,'Custom Order','102959-101-12','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(141,'Custom Order','102993-101-12','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(142,'Special Order','103021-101-12','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(143,'Special Order','103007-101-12','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(144,'Special Order','102946-101-13','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(145,'Special Order','102914-101-13','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(146,'Repair Order','102920-101-13','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(147,'Repair Order','102913-101-13','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(148,'Layaway Order','102908-101-13','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(149,'Layaway Order','102910-101-13','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(150,'Layaway Order','102912-101-13','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(151,'Custom Order','102959-101-13','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(152,'Custom Order','102993-101-13','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(153,'Special Order','103021-101-13','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(154,'Special Order','103007-101-13','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(155,'Special Order','102946-101-14','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(156,'Special Order','102914-101-14','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(157,'Repair Order','102920-101-14','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(158,'Repair Order','102913-101-14','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(159,'Layaway Order','102908-101-14','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(160,'Layaway Order','102910-101-14','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(161,'Layaway Order','102912-101-14','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(162,'Custom Order','102959-101-14','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(163,'Custom Order','102993-101-14','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(164,'Special Order','103021-101-14','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(165,'Special Order','103007-101-14','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(166,'Special Order','102946-101-15','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(167,'Special Order','102914-101-15','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(168,'Repair Order','102920-101-15','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(169,'Repair Order','102913-101-15','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(170,'Layaway Order','102908-101-15','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(171,'Layaway Order','102910-101-15','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(172,'Layaway Order','102912-101-15','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(173,'Custom Order','102959-101-15','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(174,'Custom Order','102993-101-15','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(175,'Special Order','103021-101-15','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(176,'Special Order','103007-101-15','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(177,'Special Order','102946-101-16','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(178,'Special Order','102914-101-16','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(179,'Repair Order','102920-101-16','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(180,'Repair Order','102913-101-16','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(181,'Layaway Order','102908-101-16','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(182,'Layaway Order','102910-101-16','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(183,'Layaway Order','102912-101-16','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(184,'Custom Order','102959-101-16','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(185,'Custom Order','102993-101-16','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(186,'Special Order','103021-101-16','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(187,'Special Order','103007-101-16','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(188,'Special Order','102946-101-17','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(189,'Special Order','102914-101-17','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(190,'Repair Order','102920-101-17','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(191,'Repair Order','102913-101-17','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(192,'Layaway Order','102908-101-17','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(193,'Layaway Order','102910-101-17','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(194,'Layaway Order','102912-101-17','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(195,'Custom Order','102959-101-17','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(196,'Custom Order','102993-101-17','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(197,'Special Order','103021-101-17','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(198,'Special Order','103007-101-17','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(199,'Special Order','102946-101-18','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(200,'Special Order','102914-101-18','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(201,'Repair Order','102920-101-18','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(202,'Repair Order','102913-101-18','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(203,'Layaway Order','102908-101-18','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(204,'Layaway Order','102910-101-18','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(205,'Layaway Order','102912-101-18','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(206,'Custom Order','102959-101-18','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(207,'Custom Order','102993-101-18','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(208,'Special Order','103021-101-18','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(209,'Special Order','103007-101-18','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
INSERT INTO "Orders" VALUES(210,'Special Order','102946-101-19','Chang','Judy','07/20/2023','2023','07/25/2023','-','','','','-','-','-','-','GHAD','','1029461010','WB','07/25/2023','DVA0001','','DER-1015-000','18K Y Earring Dia Wt. 0.26','18K Y Earring Dia Wt. 0.26 ct V');
INSERT INTO "Orders" VALUES(211,'Special Order','102914-101-19','Bimont','Timba','09/12/2023','2023','09/26/2023','-','','','+','-','-','-','+','HARRY','','1029141010','PO','06/25/2024','DPR0002','','DPT-323334','18K WG Dia Pendant & Ear','Pendant');
INSERT INTO "Orders" VALUES(212,'Repair Order','102920-101-19','Craven','Paul','09/12/2023','2023','09/28/2023','-','','','','-','-','-','-','CARLOS','','1029201010','WB','09/28/2023','DPR0002','','DRG-6034-000','14 KT Rings','Rings');
INSERT INTO "Orders" VALUES(213,'Repair Order','102913-101-19','Bray','Matthew','09/12/2023','2023','09/29/2023','-','','','+','-','-','-','+','DAVE','','1029131010','PO','06/25/2024','DPR0002','','DRG-594382','18K WG Dia Ring with Dia:C','Rings');
INSERT INTO "Orders" VALUES(214,'Layaway Order','102908-101-19','Ahmed','Syeda','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','DAVE','','1029081010','WB','09/30/2023','ROLEX','','RO-0002','40MM S/YG SUBMARINER DA','40MM S/YG SUBMARINER DATE');
INSERT INTO "Orders" VALUES(215,'Layaway Order','102910-101-19','Ambridge','Brittany','09/12/2023','2023','09/30/2023','-','','','','-','-','-','-','HEMAN','','1029101010','WB','09/30/2023','ROLEX','','RO-0003','40MM S/S SUBMARINER','40MM S/S SUBMARINER');
INSERT INTO "Orders" VALUES(216,'Layaway Order','102912-101-19','Antoniou','Elias','09/12/2023','2023','09/30/2023','-','','','+','-','-','-','+','GHAD','','1029121010','PO','06/25/2024','DPR0002','','DBG-275176','18K W Bangle Dia Wt. 3.25','Bangle');
INSERT INTO "Orders" VALUES(217,'Custom Order','102959-101-19','Allen-Arney','Jeremy','02/21/2024','2024','02/29/2024','-','','','','-','-','-','-','HEMAN','','1029591010','WB','02/29/2024','DPR0002','','DNK-6031-000','Necklace','Necklace');
INSERT INTO "Orders" VALUES(218,'Custom Order','102993-101-19','CHHAJLANI','ABHISHEK','08/09/2024','2024','08/16/2024','-','','','+','-','-','-','-','DAVE','','1029931010','PO','08/16/2024','DPR0002','','DRG-6034-000','Rings','Rings');
INSERT INTO "Orders" VALUES(219,'Special Order','103021-101-19','Park','Sam','12/18/2024','2024','12/20/2024','-','','','','-','-','-','-','WILLIAM','','1030211010','WB','12/20/2024','DAA0001','','DRG-1012-000','18K Y Ring Dia Wt. 0.13 ct V','18K Y Ring Dia Wt. 0.13 ct VVS');
INSERT INTO "Orders" VALUES(220,'Special Order','103007-101-19','Park','Sam','10/23/2024','2024','12/25/2024','-','','+','+','-','+','-','+','WILLIAM','','1030071010','CO','10/30/2024','TAGHEUER','','DTH-WAR201A-BA743','WTCH CARRE AUTO MG STE','WTCH CARRE AUTO MG STEEL D');
CREATE TABLE StoneCodes (
            code TEXT PRIMARY KEY,
            stoneType TEXT,
            color TEXT
        );
INSERT INTO "StoneCodes" VALUES('AX','AXDT','G');
INSERT INTO "StoneCodes" VALUES('PA','AMTY','P');
INSERT INTO "StoneCodes" VALUES('GA','AMTY','G');
INSERT INTO "StoneCodes" VALUES('AQB','AQMN','B');
INSERT INTO "StoneCodes" VALUES('BC','CTRN','B');
INSERT INTO "StoneCodes" VALUES('GC','CTRN','G');
INSERT INTO "StoneCodes" VALUES('WD','DIAM','W');
INSERT INTO "StoneCodes" VALUES('FCD','DIAM','F');
INSERT INTO "StoneCodes" VALUES('YD','DIAM','Y');
INSERT INTO "StoneCodes" VALUES('Black Diamond','DIAM','B');
INSERT INTO "StoneCodes" VALUES('GD','DIAM','G');
INSERT INTO "StoneCodes" VALUES('EM','EMRL','G');
INSERT INTO "StoneCodes" VALUES('ND','DIAM','G');
INSERT INTO "StoneCodes" VALUES('BD','DIAM','B');
INSERT INTO "StoneCodes" VALUES('KD','DIAM','K');
INSERT INTO "StoneCodes" VALUES('Tpz','TOPZ','Y');
CREATE TABLE TransactionItems (
            itemId INTEGER PRIMARY KEY AUTOINCREMENT,
            transactionId INTEGER,
            sku TEXT,
            description TEXT,
            quantity INTEGER,
            price REAL,
            FOREIGN KEY(transactionId) REFERENCES Transactions(transactionId)
        );
CREATE TABLE Transactions (
            transactionId INTEGER PRIMARY KEY AUTOINCREMENT,
            customerId INTEGER,
            salesperson TEXT,
            totalAmount REAL,
            status TEXT,
            createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
CREATE TABLE Vendors (
            code TEXT PRIMARY KEY,
            name TEXT,
            phone TEXT,
            city TEXT,
            state TEXT,
            zip TEXT,
            email TEXT
        );
INSERT INTO "Vendors" VALUES('DAA0001','AARTA Ltd','','','','','');
INSERT INTO "Vendors" VALUES('DACC001','Accar LTD., INC.','','Miami','FL','33132','');
INSERT INTO "Vendors" VALUES('DAN0001','Anila Gems','','','','','');
INSERT INTO "Vendors" VALUES('DAS0001','Aspire Designs Ltd','','','','','');
INSERT INTO "Vendors" VALUES('DAV0001','Ava Jewels Limited','','','','','');
INSERT INTO "Vendors" VALUES('DAV0002','Avance Jewels Ltd','','','','','');
INSERT INTO "Vendors" VALUES('DBAPA01','Bapalal Keshavlal','','Hughes Road','Mumbai','400','');
INSERT INTO "Vendors" VALUES('DBC0001','BC Jain','','','','','');
INSERT INTO "Vendors" VALUES('DBE0001','Beauty Jewels','','','','','');
INSERT INTO "Vendors" VALUES('DBE0002','Belgium Jewellery Inc','','','','','');
INSERT INTO "Vendors" VALUES('DBGEX01','BG EXPORTS','','','','','');
INSERT INTO "Vendors" VALUES('DBU0001','Butani Jewellers','','','','','');
INSERT INTO "Vendors" VALUES('DCF0001','C&F Jewellery MFR Ltd','','','','','');
INSERT INTO "Vendors" VALUES('DCH0001','Cheerful Jewelry Ltd','','','','','');
INSERT INTO "Vendors" VALUES('DCR0001','Crown Ring','','','','','');
INSERT INTO "Vendors" VALUES('DDI0001','Divine Jewels','','','','','');
INSERT INTO "Vendors" VALUES('DDK0001','DKN Jewellery Co LTD','','','','','');
INSERT INTO "Vendors" VALUES('DDY0001','Dynasty Jewellery','','','','','');
DELETE FROM "sqlite_sequence";
INSERT INTO "sqlite_sequence" VALUES('Orders',220);
INSERT INTO "sqlite_sequence" VALUES('Customers',15);
COMMIT;