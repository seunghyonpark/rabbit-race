'use client';
import { Slide, Chip, Button, Dialog, DialogTitle, DialogContent, DialogContentText, TextField, DialogActions } from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { GridColDef, GridApi, GridCellValue, DataGrid } from '@mui/x-data-grid';
import { getCookie } from 'cookies-next';
import React, { useEffect, useState } from 'react'
import Swal from 'sweetalert2';


const Transition = React.forwardRef(function Transition(
  props: TransitionProps & {
    children: React.ReactElement<any, any>;
  },
  ref: React.Ref<unknown>,
) {
  return <Slide direction="up" ref={ref} {...props} />;
});



export default function UserList() {
  const [users, setUsers] = useState<any>([]);
  const [open, setOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = useState<any>();


  const columns: GridColDef[] = [
    {
      field: "id",
      headerName: "ID",
      flex: 0.01,
      minWidth: 50,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "username",
      headerName: "Username",
      flex: 0.2,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "coin",
      headerName: "Coin balance",
      flex: 0.1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "matic",
      headerName: "Matic Balance",
      flex: 0.1,
      minWidth: 150,
      align: "center",
      headerAlign: "center",
    },
    {
      field: "admin",
      headerName: "Admin",
      align: "center",
      headerAlign: "center",
      type: "number",
      flex: 0.1,
      minWidth: 75,
      renderCell(params) {
        return <Chip label={`${params.value ? "Admin" : "User"}`} color={`${params.value ? "success" : "info"}`} />;
      },
    },
    {
      field: "action",
      headerName: "Edit",
      align: "center",
      headerAlign: "center",
      sortable: false,
      width: 125,
      renderCell: (params) => {
        const onClick = (e: any) => {
          e.stopPropagation(); // don't select this row after clicking

          const api: GridApi = params.api;
          const thisRow: Record<string, GridCellValue> = {};

          api
            .getAllColumns()
            .filter((c) => c.field !== "__check__" && !!c)
            .forEach(
              (c) => (thisRow[c.field] = params.getValue(params.id, c.field))
            );

          return duzenle(params.row);
        };
        return (
          <Button onClick={onClick} color="success" variant='contained' className='bg-green-500'>
            Edit
          </Button>
        );
      },
    },
  ];

  function duzenle(e: any) {
    setSelectedUser(e)
    handleClickOpen()
  }

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };


  useEffect(() => {
    getAll()
  }, [])



  const getAll = async () => {
    const res = await fetch('/api/user', {
      method: "POST",
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        method: "getAll",
        API_KEY: process.env.API_KEY,
      }),
    })
    const data = await res.json()
    setUsers(data.users.users)
  }

  const updateUser = async () => {
    let username = (document.getElementById("username") as HTMLInputElement).value
    let email = (document.getElementById("email") as HTMLInputElement).value
    let walletAddress = (document.getElementById("walletAddress") as HTMLInputElement).value
    let coinBalance = (document.getElementById("coinBalance") as HTMLInputElement).value
    let maticBalance = (document.getElementById("maticBalance") as HTMLInputElement).value
    let admin = (document.getElementById("admin") as HTMLInputElement).checked

    const formInputs = {
      method: "update",
      API_KEY: process.env.API_KEY,
      userToken: selectedUser.userToken,
      username: username,
      email: email,
      walletAddress: walletAddress,
      deposit: coinBalance,
      maticBalance: maticBalance,
      admin: admin,
      pass1: selectedUser.pass1,
      pass2: selectedUser.pass2,
      img: selectedUser.img,
    }
    handleClose();
    Swal.fire({
      title: 'Do you want to saved changes?',
      confirmButtonText: 'Save',
      showCloseButton: true,
      showCancelButton: true,
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        fetch('/api/user', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formInputs),
        })
          .then(res => res.json())
          .then(data => {
            if (data.user.success) {
              Swal.fire('Saved!', '', 'success')
              getAll()
            } else {
              Swal.fire('Error!', '', 'error')
            }
          })
      } else if (result.isDismissed) {
        // do something
      }
    })
  }

  const deleteUser = async () => {
    handleClose()
    Swal.fire({
      title: 'Do you want to delete user?',
      confirmButtonText: 'Delete!',
      showCloseButton: true,
      showCancelButton: true,
      icon: 'warning',
    }).then((result) => {
      if (result.isConfirmed) {
        const formInputs = {
          method: "delete",
          API_KEY: process.env.API_KEY,
          userToken: selectedUser.userToken,
        }
        fetch('/api/user', {
          method: "POST",
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(formInputs),
        }).then(res => res.json()).then(data => {
          if (data.status) {
            Swal.fire('Deleted!', '', 'success')
            getAll();
          } else {
            Swal.fire('Error!', '', 'error')
            getAll();
          }
        })
      } else if (result.isDismissed) {
        Swal.fire('Changes are not saved', '', 'info')
      }
    })
  }


  const rows = users.map((item: any, i: number) => {

    return {
      kayitId: item._id,
      id: i + 1,
      email1: item.email,
      img: item.img,
      admin: item.admin,
      status: item.status,
      wallet: item.walletAddress,
      username: item.username,
      pass1: item.pass1,
      pass2: item.pass2,
      userToken: item.userToken,
      coin: item.deposit,
      matic: item.maticBalance,

    }
  })

  return (
    <>
      <>
        <div className='flex flex-col p-10 mt-5 text-gray-200'>
          <h1 className='font-bold italic text-2xl'>Withdraw users (DEMO)</h1>
          <div style={{ width: "100%", height: 600, color: "white" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              pageSize={9}
              rowsPerPageOptions={[10]}
              hideFooterSelectedRowCount
              sx={{
                color: "white",
              }}
            />
          </div>
        </div>
        {selectedUser && (
          <Dialog
            open={open}
            TransitionComponent={Transition}
            keepMounted
            onClose={handleClose}
            aria-describedby="alert-dialog-slide-description"
          >
            <DialogTitle> User Edit Form</DialogTitle>
            <DialogContent className='space-y-3'>
              <TextField
                autoFocus
                margin="dense"
                id="username"
                label="Username"
                type="text"
                fullWidth
                defaultValue={selectedUser?.username}
                color='secondary'
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="email"
                label="E-Mail"
                type="text"
                fullWidth
                defaultValue={selectedUser?.email1}
                color='secondary'
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="walletAddress"
                label="Wallet Address"
                type="text"
                fullWidth
                defaultValue={selectedUser?.wallet}
                color='secondary'
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="coinBalance"
                label="Coin Balance"
                type="number"
                fullWidth
                defaultValue={selectedUser?.coin}
                color='secondary'
                variant="standard"
              />
              <TextField
                autoFocus
                margin="dense"
                id="maticBalance"
                label="Matic Balance"
                type="number"
                fullWidth
                defaultValue={selectedUser?.matic}
                color='secondary'
                variant="standard"
              />

              <div className='flex gap-1 items-center'>
                <input type="checkbox" defaultChecked={selectedUser?.admin} id='admin' className="checkbox checkbox-primary" />
                <p>Admin?</p>
              </div>

            </DialogContent>
            <DialogActions>
              <Button color='error' onClick={deleteUser}>Delete</Button>
              <Button onClick={handleClose}>Close</Button>
              <Button color='success' onClick={updateUser}>Save</Button>
            </DialogActions>
          </Dialog>
        )}
      </>
    </>
  )
}
