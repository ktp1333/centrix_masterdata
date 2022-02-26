var app = angular.module("myApp", ["ngMaterial", "angular-md5"]);
app.controller(
  "m_orderController",
  function (
    $scope,
    $location,
    $http,
    $timeout,
    $mdSidenav,
    $window,
    $q,
    $filter,
    globalSetting,
    md5
  ) {
    var vm = this;

    $scope.xlsx2json = xlsx2json;
    $scope.migrate = migrate;
    $scope.mongo2table = mongo2table;
    $scope.savecc = savecc;
    $scope.downloadFile = downloadFile;
    $scope.downloadTypeChange = downloadTypeChange;
    vm.renderTable = renderTable;
    $scope.renderTable1 = renderTable1;
    $scope.JSONToCSVConvertor = JSONToCSVConvertor;
    $scope.printFile = printFile;
    $scope.save2template = save2template;
    $scope.right = true;
    vm.filename = "";
    vm.downloadSupports = ["csv", "xlsx", "pdf", "json"];
    vm.selectedDownload =
      localStorage.getItem("DOWNLOAD_TYPE") || vm.downloadSupports[0];
    vm.table = null;
    vm.table1 = null;
    vm.cc = "";
    vm.ordercat = "";
    var mcc = [];
    $scope.listOrdercategories = listOrdercategories;
    vm.notename = "";
    vm.note = "";
    vm.notetype = "";
    $scope.savenote = savenote;
    $scope.note_text = "";
    $scope.cc_text = "";
    $scope.finddetail = finddetail;
    $scope.findordercat = findordercat;
    $scope.add2ordercattype = add2ordercattype;
    $scope.save2db = save2db;
    vm.showadd = false;
    $scope.clearvm = clearvm;
    $scope.show_detail = show_detail;
    $scope.deletejson = deletejson;

    getOrguid();
    function add2ordercattype(name, description) {
      console.log("name", name);
      console.log("description", description);
      async.waterfall(
        [
          function get1(callback) {
            vm.results.push({
              NAME: name || "",
              DESCRIPTION: description || "",
            });

            callback();
          },
          function get2(callback) {
            console.log(vm.results);
            renderTable1("#table1");
            callback();
          },
        ],
        function () {}
      );
    }
    function save2db(mfile) {
      console.log(mfile);
      mdata = vm.results;
      $http
        .post("/importdata/insertpt", {
          filename: mfile,
          jsondata: mdata,
        })
        .success(function (response) {
          $scope.note_text = "Migrate Ready";
        });
    }
    function getOrguid() {
      $http.get("/org-config").then(function (success) {
        var orgSite = success.data.org;
        $scope.orguid = globalSetting.setting.orguid[orgSite];
        $scope.iip = globalSetting.setting.url[orgSite];
        console.log($scope.orguid);
        listOrdercategories();
      });
    }
    function findordercat() {
      $http
        .post("/centrix_master/find_ordercategories", {
          orguid: "569794170946a3d0d588efe6",
          name: vm.ordercat,
        })
        .success(function (data) {
          var array = data.data;
          $scope.ordercategories = array;
          console.log("ordercategories", $scope.ordercategories);

          vm.results = data.data;
          renderTable("#mytable");
        });
    }
    function listOrdercategories() {
      $http
        .post("/centrix_master/list_ordercategories", {
          orguid: "569794170946a3d0d588efe6",
        })
        .success(function (data) {
          var array = data.data;
          $scope.ordercategories = array;
          console.log("ordercategories", $scope.ordercategories);

          vm.results = data.data;
          renderTable("#mytable");
        });
    }
    function finddetail(ID) {
      $http
        .post("/centrix_master/find_detail", {
          orguid: "569794170946a3d0d588efe6",
          ID: ID,
        })
        .success(function (data) {
          $scope.itemdetail = data.data;
          console.log("itemdetail", $scope.itemdetail[0]);

          var table = document.createElement("table");
          var data = $scope.itemdetail[0];
          for (var key in data) {
            if (!data.hasOwnProperty(key)) {
              continue;
            }
            console.log(key + " -> " + data[key]);
            var tri = table.insertRow(-1);
            // var trx = document.createElement("tr"); // TABLE HEADER.
            // tri.innerHTML =key;
            // tri.appendChild(trx);
            var tabCell = tri.insertCell(0);
            tabCell.innerHTML = key;
            var tabCell = tri.insertCell(1);
            tabCell.innerHTML = data[key];
          }

          var divContainer = document.getElementById("myData");
          divContainer.innerHTML = "";
          divContainer.appendChild(table);
          // const myObj =$scope.itemdetail;
          // let text = "<table border='1'>";
          // for (let x in myObj) {
          //   text += "<tr><td>" + myObj[x].name + "</td></tr>";
          // }
          // text += "</table>";
          // document.getElementById("myData").innerHTML = text;
        });
    }
    //-----------------------

    function savenote(mloginid, mpassword, mnotename, mnotetype, mnotedetail) {
      if (mnotetype != "") {
        async.waterfall(
          [
            function get1(callback) {
              $http
                .post("/centrix_migrate/find_lastcode", {
                  // "mfile": mfile,
                  "orguid ": $scope.orguid,
                })
                .success(function (data) {
                  $scope.notecode = (data.data[0].codeint + 1).toString();
                  console.log("notecode", $scope.notecode);
                  console.log("mnotename", mnotename);
                  console.log("mnotetype", mnotetype);
                  console.log("mnotedetail", mnotedetail);
                  console.log("mloginid", mloginid);
                  console.log("mpassword", mpassword);
                  if (mloginid && mpassword) {
                    var passwordEncrypt = md5.createHash(mpassword);
                    $http
                      .get(
                        `/security/login/${mloginid}/${shake128(
                          passwordEncrypt,
                          256
                        )}/${passwordEncrypt}`
                      )
                      .then(
                        function (response) {
                          $scope.user = response.data.user;
                          console.log("$scope.user", $scope.user);
                          if ($scope.user) {
                            var museruid = $scope.user._id;
                            var mfile = "favouritenotes";
                            var today = new Date();

                            $http
                              .post("/centrix_migrate/save_note", {
                                mfile: mfile,
                                code: $scope.notecode,
                                name: mnotename,
                                orguid: $scope.orguid,
                                useruid: museruid,
                                createdby: museruid,
                                modifiedby: museruid,
                                createdat: new Date(),
                                modifiedat: new Date(),
                                statusflag: "A",
                                notetext: mnotedetail,
                                notetypeuid: mnotetype,
                              })
                              .success(function (response) {
                                $scope.note_text = "บันทึกสำเร็จ";
                                vm.loginid = "";
                                vm.password = "";
                                vm.notename = "";
                                vm.notetype = "";
                                vm.notedetail = "";
                              });
                          } else {
                            $scope.note_text = "ชื่อหรือรหัสผ่าน ไม่ถูกต้อง";
                          }
                        },
                        function (errresponse) {
                          $scope.note_text = "ชื่อหรือรหัสผ่าน ไม่ถูกต้อง";
                          console.error(errresponse);
                          alert("ชื่อหรือรหัสผ่าน ไม่ถูกต้อง");
                        }
                      );
                  } else {
                    $scope.note_text = "ชื่อหรือรหัสผ่าน ไม่ถูกต้อง";
                  }
                  callback();
                });
            },
            function get2(callback) {
              callback();
            },
          ],
          function () {}
        );
      } else {
        $scope.note_text = "Please select note template type";
      }
    }

    function savecc(params) {
      console.log(params);
      mcc.push({
        chiefcomplaint: params,
      });
      vm.results = mcc;
      console.log(vm.results);
      renderTable("#mytable");
      vm.cc = "";
      $scope.cc_text = "";
    }
    function save2template(loginid, pwd) {
      //query หา  user
      var username = loginid;
      var mpwd = pwd;
      console.log("username", username);
      console.log("mpwd", mpwd);
      if (username && mpwd) {
        var passwordEncrypt = md5.createHash(mpwd);
        $http
          .get(
            `/security/login/${username}/${shake128(
              passwordEncrypt,
              256
            )}/${passwordEncrypt}`
          )
          .then(
            function (response) {
              $scope.user = response.data.user;
              console.log("$scope.user", $scope.user);
              if ($scope.user) {
                var array = vm.results;
                var mcchpilist = [];
                for (let index = 0; index < array.length; index++) {
                  const m_orderlist = array[index].chiefcomplaint;
                  mcchpilist.push({
                    chiefcomplaint: m_orderlist,
                  });
                }
                var mcode = $scope.user.code;
                var mname = $scope.user.name;
                var museruid = $scope.user._id;
                var mfile = "favouritecchpis";
                var today = new Date();
                console.log("today", today);
                console.log("mfile", mfile);
                console.log("mcode", mcode);
                console.log("mname", mname);
                console.log("museruid", museruid);
                console.log("$scope.morguid", $scope.morguid);

                console.log("createdby", museruid);
                console.log("createdat", today);
                console.log("modifiedby", museruid);
                console.log("modifiedat", today);
                console.log("cchpilist", mcchpilist);
                $http
                  .post("/centrix_migrate/save_cchpi", {
                    mfile: mfile,
                    code: mcode,
                    name: mname,
                    orguid: $scope.orguid,
                    useruid: museruid,
                    createdby: museruid,
                    modifiedby: museruid,
                    createdat: new Date(),
                    modifiedat: new Date(),
                    statusflag: "A",
                    cchpilist: mcchpilist,
                  })
                  .success(function (response) {
                    $scope.cc_text = "บันทึกสำเร็จ";
                    vm.results = [];
                    vm.cc = "";
                    var mcc = [];
                    renderTable("#mytable");
                  });
              } else {
                $scope.cc_text = "ชื่อหรือรหัสผ่าน ไม่ถูกต้อง";
              }
            },
            function (errresponse) {
              $scope.cc_text = "ชื่อหรือรหัสผ่าน ไม่ถูกต้อง";
              console.error(errresponse);
              alert("ชื่อหรือรหัสผ่าน ไม่ถูกต้อง");
            }
          );
      } else {
        $scope.cc_text = "ชื่อหรือรหัสผ่าน ไม่ถูกต้อง";
      }
    }
    function xlsx2json(mtable) {
      vm.showadd = true;
      // vm.selectedFile =document.getElementById('input').value;
      var selectedFile = document.getElementById("input").files[0];

      //     XLSX.utils.json_to_sheet(data, 'out.xlsx');
      if (selectedFile) {
        let fileReader = new FileReader();
        fileReader.readAsBinaryString(selectedFile);
        fileReader.onload = (event) => {
          let data = event.target.result;
          let workbook = XLSX.read(data, {
            type: "binary",
          });
          //  console.log(workbook);
          workbook.SheetNames.forEach((sheet) => {
            var rowObject = XLSX.utils.sheet_to_row_object_array(
              workbook.Sheets[sheet]
            );
            //   console.log(rowObject);
            vm.results = rowObject;
            //   document.getElementById("jsondata").innerHTML = JSON.stringify(rowObject,undefined,4)
          });
          console.log(vm.results);
          renderTable1(mtable);
        };
      }
    }
    function renderTable1(mtable) {
      // var tableSetting = new Tabulator(mtable, {
      var tableSetting = {
        // height: "600px",
        virtualDomHoz: true,
        // layout: "fitDataTable",
        data: vm.results, //load row data from array
        autoColumns: true, //create columns from data field names
        rowClick: function (e, row) {
          console.log(row.getData());
          show_detail(row.getData());
        },

        layout: "fitColumns", //fit columns to width of table
        // responsiveLayout: "hide", //hide columns that dont fit on the table
        // tooltips: true, //show tool tips on cells
        // addRowPos: "top", //when adding a new row, add it to the top of the table
        // history: true, //allow undo and redo actions on the table
        // pagination: "local", //paginate the data
        // paginationSize: 20, //allow 7 rows per page of data
        // movableColumns: true, //allow column order to be changed
        // resizableRows: true, //allow row order to be changed
      };

      vm.table1 = new Tabulator(mtable, tableSetting);
    }
    function show_detail(params) {
      console.log(params);
      vm.name = params.NAME;
      vm.description = params.DESCRIPTION;
      console.log(vm.name);
      console.log(vm.description);
      $scope.$apply();
    }
    function deletejson(mname, mdescription) {
      console.log(mname);
      console.log(mdescription);
      var mmm = vm.results;
      vm.results = vm.results.filter((item) => item.NAME != mname);
      console.log(vm.results);
      renderTable1("#table1");
      clearvm();
    }
    function clearvm() {
      vm.name = "";
      vm.description = "";
      var divContainer1 = document.getElementById("inputname");
      divContainer1.innerHTML = "";
      var divContainer2 = document.getElementById("inputdescription");
      divContainer2.innerHTML = "";
      divContainer1.focus();
    }
    function renderTable(mtable) {
      // var tableSetting = new Tabulator(mtable, {
      var tableSetting = {
        height: "450px",
        virtualDomHoz: true,
        layout: "fitDataTable",
        data: vm.results, //load row data from array
        autoColumns: true, //create columns from data field names
        rowClick: function (e, row) {
          console.log(row.getData().ID);
          finddetail(row.getData().ID);
        },

        // layout: "fitColumns", //fit columns to width of table
        // responsiveLayout: "hide", //hide columns that dont fit on the table
        // tooltips: true, //show tool tips on cells
        // addRowPos: "top", //when adding a new row, add it to the top of the table
        // history: true, //allow undo and redo actions on the table
        // pagination: "local", //paginate the data
        // paginationSize: 20, //allow 7 rows per page of data
        // movableColumns: true, //allow column order to be changed
        // resizableRows: true, //allow row order to be changed
      };

      vm.table = new Tabulator(mtable, tableSetting);
    }
    function migrate(mfile, mdata) {
      $http
        .post("/importdata/insertfile", {
          mfile: mfile,
          jsondata: mdata,
        })
        .success(function (response) {
          $scope.note_text = "บันทึกสำเร็จ";
        });
    }
    function mongo2table(mfile) {
      console.log(mfile);
      vm.headertxt = mfile;
      $http
        .post("/centrix_migrate/list_dbdetail", {
          mfile: mfile,
          orguid: $scope.orguid,
        })
        .success(function (data) {
          vm.results = data.data;
          vm.renderTable("#table_mongo2table");
        });
    }
    function downloadTypeChange(fileType) {
      localStorage.setItem("DOWNLOAD_TYPE", fileType);
    }
    function downloadFile(fileType) {
      if (fileType === "pdf") {
        vm.table.download(fileType, vm.headertxt, {
          autoTable: function (doc) {
            var doc = new jsPDF();
            doc.addFont("THSarabunNew", "bold");
            doc.setFont("THSarabunNew", "bold");
            doc.setFontSize(16);
            var header = function (data) {
              doc.setFontSize(18);
              doc.setTextColor(40);
              doc.setFont("THSarabunNew", "normal");
              doc.text("", data.settings.margin.left, 50);
            };
            return {
              styles: {
                font: "THSarabunNew",
                fontStyle: "bold",
                fontSize: 16,
              },
              headStyles: {
                fillColor: [0, 78, 82],
              },
              didDrawPage: header,
              margin: {
                top: 65,
              },
              theme: "grid",
            };
          },
        });
      } else if (fileType === "xlsx") {
        if (vm.table) {
          vm.table.download(fileType, vm.headertxt + "." + fileType, {
            sheetName: "Report",
            documentProcessing: (workbook) => {
              var data = vm.table.getData();
              var ws = XLSX.utils.aoa_to_sheet([
                // [vm.headertxt + '  ' + vm.subtitletext],
                // [vm.datetitle]
              ]);

              if (data && data.length > 0) {
                var header = Object.keys(data[0]);

                // XLSX.utils.sheet_add_json(ws, data, { header: header, origin: "A3" });
                XLSX.utils.sheet_add_json(ws, data, {
                  header: header,
                  origin: "A1",
                });
                ws["!cols"] = header.map((h) => ({
                  wch: 20,
                }));

                // var mergeCell = [XLSX.utils.decode_range('A1:G1'), XLSX.utils.decode_range('A2:G2')];
                // ws['!merges'] = mergeCell;
              }
              workbook.Sheets[workbook.SheetNames[0]] = ws;
              return workbook;
            },
          });
        }
      } else if (fileType === "csv") {
        var JSONData = vm.table.getData();
        // var ReportTitle = vm.headertxt+ '.' + fileType;
        JSONToCSVConvertor(JSONData, vm.headertxt, true);
      } else {
        vm.table.download(fileType, vm.headertxt + "." + fileType);
      }
    }
    function printFile() {
      vm.table.print();
    }
    function JSONToCSVConvertor(JSONData, ReportTitle, ShowLabel) {
      console.log(JSONData);
      console.log(ReportTitle);
      console.log(ShowLabel);
      //If JSONData is not an object then JSON.parse will parse the JSON string in an Object
      var arrData =
        typeof JSONData != "object" ? JSON.parse(JSONData) : JSONData;

      var CSV = "";
      //Set Report title in first row or line

      CSV += ReportTitle + "\r\n\n";

      //This condition will generate the Label/Header
      if (ShowLabel) {
        var row = "";

        //This loop will extract the label from 1st index of on array
        for (var index in arrData[0]) {
          //Now convert each value to string and comma-seprated
          row += index + ",";
        }

        row = row.slice(0, -1);

        //append Label row with line break
        CSV += row + "\r\n";
      }

      //1st loop is to extract each row
      for (var i = 0; i < arrData.length; i++) {
        var row = "";

        //2nd loop will extract each column and convert it in string comma-seprated
        for (var index in arrData[i]) {
          row += '"' + arrData[i][index] + '",';
        }

        row.slice(0, row.length - 1);

        //add a line break after each row
        CSV += row + "\r\n";
      }

      if (CSV == "") {
        alert("Invalid data");
        return;
      }

      //Generate a file name
      // var fileName = "MyReport_";
      var fileName = "";
      //this will remove the blank-spaces from the title and replace it with an underscore
      fileName += ReportTitle.replace(/ /g, "_");
      // fileName='kit';
      //Initialize file format you want csv or xls
      var uri = "data:text/xls;charset=utf-8," + escape(CSV);
      // downloadFile('1.csv', 'data:text/csv;charset=UTF-8,' + '\uFEFF' + encodeURIComponent(CSV));
      var uri =
        "data:text/csv;charset=utf-8," + "\uFEFF" + encodeURIComponent(CSV);
      // var uri = 'data:text/csv;charset=utf-8,' + escape(CSV);
      // console.log('vm.table', vm.table);
      // console.log('CSV', CSV);
      // console.log('uri', uri);

      //Download the file as CSV
      var downloadLink = document.createElement("a");
      var blob = new Blob(["\ufeff", CSV]);
      var url = URL.createObjectURL(blob);
      downloadLink.href = url;
      downloadLink.download = ReportTitle; //Name the file here
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      // CSV.download('csv', `${$rootScope.selectedRoute.title}.csv`);
      // window.open(uri);
      // Now the little tricky part.
      // you can use either>> window.open(uri);
      // but this will not work in some browsers
      // or you will not get the correct file extension

      //this trick will generat
    }
  }
);
