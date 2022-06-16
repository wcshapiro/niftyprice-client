import { React, useEffect, useState } from "react";
import Button from "@material-ui/core/Button";
import ButtonGroup from "@material-ui/core/ButtonGroup";

import Grid from "@material-ui/core/Grid";
import "../components/AdBar.css";
import "../components/Table.css";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { makeStyles } from "@material-ui/core/styles";
import CardMedia from "@material-ui/core/CardMedia";

const useStyles = makeStyles({
  adbar:{
overflow:"scroll",
scrollbarWidth:"none",
'&::-webkit-scrollbar': {
  width: '0',
  height:'0'
},
marginTop: "1rem",
width:"100%",
marginLeft:"1rem"

  },
  root: {
    
    width:350
   
  },
  content:{
    
    padding:0

  },
  image: {
    alt: null,
    width: "100%",
    padding:0
  },
  linkGroup: {
    width: "100%",
  },
});
function AdBar() {
  const classes = useStyles();
  const [ads, setAds] = useState([]);
  const loadAds = async () => {
    let adslist = [];
    let adsMap = {
      ads: [
        {
          slug: "mutant-ape-yacht-club",
          name: "Mutant Ape Yacht Club",
          description:
            "Created by exposing an existing Bored Ape to a vial of MUTANT SERUM",
          image:
            "https://lh3.googleusercontent.com/Olouh-R1vrlmvv07asNmRwfdJolcdDvyjSm3KhH9d9_nDywjrWIIA9Ym4jgqrQY_zZZ6n4842n4lxsvpYfWFkA-TeaH-tBwQ8bmK0gQ=w600",
          links: [
            {
              name: "EtherScan",
              link: "https://etherscan.io/address/0x60e4d786628fea6478f785a6d7e704777c86a7c6",
            },
            {
              name: "BUY",
              link: "https://opensea.io/collection/mutant-ape-yacht-club",
            },
            {
              name: "Chart",
              link: "https://www.niftyprice.io/collections/mutant-ape-yacht-club",
            },
          ],
        },
        {
          slug: "world-of-women-nft",
          name: "World of Women",
          description:
            "A community celebrating representation, inclusivity, and equal opportunities for all",
          image:
            "https://lh3.googleusercontent.com/Iu7QfrYNHjrF_VKjH3Pnyn3PpNnv4JuGsykFnQcoWmLgiDDziBT8eB32CJuo2INsTXuW0JnWiIrwtEwWvzayMxWusbk7pKaRr7w5JQ=w600",
          links: [
            {
              name: "EtherScan",
              link: "https://etherscan.io/address/0xe785e82358879f061bc3dcac6f0444462d4b5330",
            },

            {
              name: "Chart",
              link: "https://niftyprice.io/collections/world-of-women-nft",
            },
          ],
        },
        {
          slug: "doodles-official",
          name: "Doodles",
          description:
            "A community-driven collectibles project featuring art by Burnt Toast",
          image:
            "https://lh3.googleusercontent.com/FP9sj39ejYX1vEPCXQngXue-OLqPivifupVDoOJwxLBjY1d1b4mPiol34Wn5A8mgNzZ1SpeGGYCxFdn4nG27Ze5T2JY9tc-c4efOYCI=w284",
          links: [
            {
              name: "BUY",
              link: "https://opensea.io/collection/doodles-official",
            },
          ],
        },
        
        {
          name: null,
          description: null,
          image: null,
          links:[]
        },
      ],
    };
    Object.values(adsMap.ads).forEach((ad) => {
      let linkButtons = []
      Object.values(ad.links).forEach((link) => {
        linkButtons.push(
          
            <Button
              onClick={() => {
                window.open(link.link);
              }}
            >
              {link.name}
            </Button>
          
        );
      })
      if (ad.name) {
        adslist.push(
          <Grid item lg={2}  >
            <Card  className={classes.root} elevation={5}>
              <Grid container justifyContent="flex-start" spacing={0}>
                <Grid item xs={6}  className={classes.content}>
                  <CardMedia
                    component="img"
                    className={classes.image}
                    image={ad.image}
                  />
                </Grid>

                <Grid item xs={6} >
                  <Grid container  className={classes.content}>
                    
                      <Grid item xs={12}>
                        <p class="ad-title">
                          {ad.name}
                        </p>
                      </Grid>
                      <Grid item xs={12}>
                        <p class="ad-description">{ad.description}</p>
                      </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  <ButtonGroup fullWidth={true} variant="outlined">
                    {linkButtons}
                   
                  </ButtonGroup>
                </Grid>
              </Grid>
            </Card>
          </Grid>
        );
      } else
        adslist.push(
          <Grid item lg={2} align="center">
            <Button
              variant="contained"
              style={{ backgroundColor: "#1C72D9", color: "#FFFFFF" }}
              onClick={()=>window.open("https://docs.google.com/forms/d/e/1FAIpQLSe0kyulpyR3SPNT2kyFkdCMNWZncdKvlEBB9f7ae8i8VGz-sQ/viewform?usp=sf_link")}
            >
              Highlight Project
            </Button>
          </Grid>
        );
    });

    setAds(adslist);
  };
  useEffect(() => {
    loadAds();
  }, []);
  return (
    <>
      <Grid
      className={classes.adbar}
        container
        wrap='nowrap'
        justifyContent="space-between"
        alignItems="center"
        spacing={1}
      >
        {ads}
      </Grid>
    </>
  );
}
export default AdBar;
