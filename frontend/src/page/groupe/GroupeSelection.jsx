import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  Typography,
  Button,
  IconButton,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { MdEmojiEmotions, MdMenu } from "react-icons/md";
import { AiTwotoneLike } from "react-icons/ai";
import { FaRegMessage } from "react-icons/fa6";
import { IoMdPhotos } from "react-icons/io";
import { Emoji } from "emoji-picker-react";
import { IoSend } from "react-icons/io5";
import noname from "../../assets/icone/personne.jpeg";
const GroupeSelection = () => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down("md"));

  const [open, setOpen] = useState(false);
  return (
    <div>
      <Button variant="contained" onClick={() => setOpen(true)}>
        Ouvrir le dialogue
      </Button>
      <Dialog
        fullScreen={fullScreen}
        open={open}
        onClose={() => setOpen(false)}
        style={{ scrollbarWidth: "thin" }}
      >
        <DialogContent>
          <div
            className="
          "
          >
            <div className="">
              <p>
                <img src="" alt="" />
                <span>histoire de magie</span>
              </p>
              <div className="">
                <p>menu</p>
                <div className="">
                  <p>supprimer le groupe</p>
                  <p>rédiger une publication</p>
                  <p>membres du groupe</p>
                  <div className="">
                    <img src="" alt="" />
                    <p>dimitri</p>
                    <div className="">
                      <p>supprimer</p>
                      <span>supprimer</span>
                    </div>
                    <div className="">
                      <p>star</p>
                      <span>menbres gold</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="">
              <p>description du groupe</p>
              <p></p>
            </div>
            <div className="">
              <div className="PublicationShow">
                <div className="PublicationPost">
                  <div className="PublicationPost-Menu">
                    <p
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "15px",
                        fontWeight: "bold",
                      }}
                    >
                      <img src="" alt="" /> Dimitri
                    </p>
                    <div className="PublicationPost-Menu-Icon">
                      <span>
                        <MdMenu
                          style={{ cursor: "pointer" }}
                          className="ButtonMenu"
                        />
                      </span>
                    </div>
                  </div>
                  <div className="TextePublication">
                    <div className="HeaderPublication">
                      <p>
                        Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        Nostrum quod eveniet eius illo corporis ex a sit minus
                        at debitis necessitatibus temporibus nisi veniam libero
                        voluptates expedita, maiores nobis magni. Lorem ipsum
                        dolor sit amet consectetur adipisicing elit. Laborum
                        neque illum obcaecati minima, rerum sit. Repellendus
                        repudiandae veniam dicta qui ab, quaerat impedit
                        consequatur eaque, doloribus ducimus facere accusantium
                        nihil!
                        <span>...</span>
                      </p>
                    </div>
                    <div className="HealthPublication">
                      <img src={noname} alt="" />
                    </div>
                    <div className="LikingPublication">
                      <div className="LikingUp">
                        <p>
                          <AiTwotoneLike id="like" />
                          <span>15</span>
                        </p>

                        <p style={{ fontWeight: "bold" }}>15 commentaires</p>
                      </div>
                      <div className="LikingDown">
                        <p>
                          <AiTwotoneLike id="likes" /> Like
                        </p>
                        <p>
                          <FaRegMessage id="likes" /> Commenter
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="CommentArea">
                  {/*affichage des messages principaux */}

                  <>
                    <div className="">
                      <div className="PrioritySms">
                        <div className="SmsWrite">
                          <p id="textPriorirySms">
                            <span>
                              <img src="" alt="" /> Dimitri <label>10h</label>
                            </span>
                            dimi
                            <img src="" alt="" id="photoCommentaire" />
                          </p>
                          <div className="SmsOptionLiking">
                            <p>
                              <AiTwotoneLike id="likes" /> Like
                            </p>
                            <p>
                              <FaRegMessage id="likes" /> Répondre
                            </p>
                          </div>
                        </div>
                        <div className="SmsLike">
                          <span>
                            15 <AiTwotoneLike id="likePriority" />{" "}
                          </span>
                        </div>
                      </div>
                      {/*Sous Commentaire */}
                      // Parcourt toutes les réponses secondaires associées à ce
                      commentaire principal.
                      <div className="">
                        <div className="SecondarySms">
                          <div className="SmsWrite">
                            <p id="textPriorirySms">
                              <span>
                                <img src="" alt="" /> simo <label>10h</label>
                              </span>

                              {/* Affiche le texte de la réponse */}

                              {/* Si une photo est jointe à la réponse, elle est affichée ici */}
                            </p>
                            <div className="SmsOptionLiking">
                              <p>
                                <AiTwotoneLike id="likes" /> Like
                              </p>
                              <p>
                                <FaRegMessage id="likes" /> Répondre
                              </p>
                            </div>
                          </div>
                          <div className="SmsLike">
                            <span>
                              <AiTwotoneLike id="likePriority" />{" "}
                            </span>
                          </div>
                        </div>

                        <div className="ThirdSms">
                          <div className="SmsWrite">
                            <p id="textPriorirySms">
                              <span>
                                <img src={noname} alt="" /> simo{" "}
                                <label>10h</label>
                              </span>
                              rfqdsfqdsf
                              <img src="" alt="" id="photoCommentaire" />
                            </p>
                            <div className="SmsOptionLiking">
                              <p>
                                <AiTwotoneLike id="likes" /> Like
                              </p>
                            </div>
                          </div>
                          <div className="SmsLike">
                            <span>
                              15
                              <AiTwotoneLike id="likePriority" />{" "}
                            </span>
                          </div>
                          {/*ouverture troiseme */}
                        </div>

                        {/*ouverture deuxieme */}
                      </div>
                      {/*ouverture first */}
                    </div>
                  </>

                  {/*autres sous commentaire */}
                </div>

                <div className="PublicationCommentaire">
                  <div className="WrittingPrincipalComment">
                    <form action="">
                      <textarea name="" id=""></textarea>
                      <div className="OptionComment">
                        <p>
                          <span>
                            <input
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                            />
                            <IoMdPhotos className="ButtonMenu" />
                          </span>
                          <span>
                            <MdEmojiEmotions className="ButtonMenu" />

                            <div className="" id="emoji">
                              <Emoji />
                            </div>
                          </span>
                        </p>
                        <button type="button">
                          <IoSend className="ButtonMenu" />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GroupeSelection;
