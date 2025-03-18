import React from "react";
import {
  Grid,
  TextField,
  Select,
  MenuItem,
  Button,
  Typography,
  Card,
  CardContent,
  Avatar,
  IconButton,
} from "@mui/material";
import { Edit } from "@mui/icons-material";

export default function EditProfile() {
  return (
    <Card sx={{ maxWidth: 1200, margin: "auto", padding: 2 }}>
      <CardContent>
        <Typography variant="h6" mb={2}>
          My Profile 
        </Typography>
        <Grid container spacing={3}>
          {/* Avatar and First/Last Name */}
          <Grid item xs={12} sm={4} display="flex" alignItems="center">
            <Avatar
              src="/avatar.jpg" // Replace with dynamic URL
              sx={{ width: 100, height: 100 }}
            />
            <IconButton sx={{ marginLeft: 2 }}>
              <Edit />
            </IconButton>
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="First Name" defaultValue="Arthur" />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField fullWidth label="Last Name" defaultValue="Nancy" />
          </Grid>

          {/* Email and Password */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Email"
              defaultValue="bradley.ortiz@gmail.com"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Password"
              type="password"
              defaultValue="********"
              InputProps={{
                endAdornment: (
                  <IconButton sx={{ marginLeft: 2 }}>
              <Edit />
              </IconButton>
                ),
              }}
            />
          </Grid>

          {/* Address and Phone */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Phone"
              defaultValue="477-046-1827"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Address"
              defaultValue="116 Jaskolski Stravenue Suite 883"
            />
          </Grid>

          {/* Nation */}
          <Grid item xs={12} sm={6}>
            <TextField fullWidth label="Nation" defaultValue="Colombia" />
          </Grid>

          {/* Gender and Language */}
          <Grid item xs={12} sm={6}>
            <Select fullWidth defaultValue="Male">
              <MenuItem value="Male">Male</MenuItem>
              <MenuItem value="Female">Female</MenuItem>
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Select fullWidth defaultValue="English">
              <MenuItem value="English">English</MenuItem>
              <MenuItem value="Spanish">Spanish</MenuItem>
              <MenuItem value="French">French</MenuItem>
            </Select>
          </Grid>

          {/* Social Media Links */}
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Twitter"
              defaultValue="twitter.com/envato"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="LinkedIn"
              defaultValue="linked.in/envato"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Facebook"
              defaultValue="facebook.com/envato"
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              label="Google"
              defaultValue="zachary.ruiz"
            />
          </Grid>
          </Grid>
        

        {/* Save Button */}
        <Grid container justifyContent="flex-end" mt={3}>
          <Button variant="outlined" color="secondary" sx={{ mr: 2 }}>
            Cancel
          </Button>
          <Button variant="contained" color="primary">
            Save
          </Button>
        </Grid>
      </CardContent>
    </Card>
  );
}
