
library(shiny)
library(leaflet)
library(RColorBrewer)
library(ggplot2)
library(reshape)


load("n.RData")
load("zv.RData")
z_scores2d = as.data.frame(z_scores2d)


ui <- bootstrapPage(
  tags$style(type = "text/css", "html, body {width:100%;height:100%}"),
  leafletOutput("map", width = "100%", height = "100%"),
  absolutePanel(top = 10, right = 10, width = 400,
                
                selectInput("group","Groups", choices = c("All", sort(unique(n$PAMclustersd))), selected = "All"                  
                            
                ),
                selectInput("colors", "Color Scheme",
                            rownames(subset(brewer.pal.info, category == 'qual', colorblindFriendly = TRUE))
                            
                ),
                checkboxInput("legend", "Show legend", TRUE),
                plotOutput("barplot", height = 350, width = 400)
                # plotOutput("scatter", height =150, width = 400, brush = "scatter_brush")
                
                
  )
)

server <- function(input, output, session) {
  
  observe({
    print(input$map_shape_click)
  })
  
  observe({
    print(input$map_bounds)
  })
  
  saInBounds <- reactive({
    if (is.null(input$map_bounds))
      return(n[FALSE,])
    
    bounds <- input$map_bounds
    
    centroids <- coordinates(n)
    
    n[centroids[,1] > bounds$west &
        centroids[,1] < bounds$east &
        centroids[,2] > bounds$south &
        centroids[,2] < bounds$north,]
  })
  
  
  filteredData <- reactive({
    if(input$group == "All"){
      n
    } else {
      n[!is.na(n$PAMclustersd) & n$PAMclustersd == input$group,]
    }
  })
  
  colorpal <- reactive({
    print(input$colors)
    colorFactor(input$colors, n$PAMclustersd)
  })
  
  # brushedData <- reactive({
  #   selectedData = brushedPoints(n@data, input$scatter_brush, xvar="owned_mortgage", yvar="housing_total")
  #   selectedData$SMALL_AREA
  # })
  
  
  output$map <- renderLeaflet({
    
    map <- leaflet(n) %>% 
      addProviderTiles(providers$CartoDB.Positron) %>%
      fitBounds(n@bbox[1], n@bbox[2], n@bbox[3], n@bbox[4]) 
    
  })
  
  output$barplot <- renderPlot({
    if (input$group != "All"){
      df = melt(sort(z_scores2d[as.numeric(input$group),]))
      ggplot(df, aes(value, variable)) + geom_point()
      
    }
    else {
      df=melt(z_scores2d)
      ggplot(df, aes(value, variable)) + geom_point()
      
    }
  })
  
  # output$scatter <- renderPlot ({
  #   n.subset <- saInBounds()
  #   ggplot(n.subset@data, aes(owned_mortgage, housing_total))+
  #     geom_point()+
  #     coord_cartesian(xlim = n.subset@data$owned_mortgage, ylim = n.subset@data$housing_total)
  # })
  
  
  observe({
    pal <- colorpal()
    proxy <- leafletProxy("map", data = filteredData()) %>%
      clearShapes() %>%
      addPolygons(
        fillColor = ~pal(PAMclustersd),
        #weight = ~(ifelse(SMALL_AREA %in% brushedData(), 5, 0.3)),
        weight = 0.2,
        opacity = 0.5,
        #color = ~(ifelse(SMALL_AREA %in% brushedData(), "gray25", "grey95")), 
        color = "white",
        fillOpacity = 0.9,
        highlight = highlightOptions(
          weight = 4,
          color = "black",
          fillOpacity = 0.7,
          bringToFront = TRUE
        ),
        label = ~paste0(PAMclustersd, " - ",
                        EDNAME, " - ",
                        COUNTYNAME 
        ),
        layerId = ~SMALL_AREA
      )
  })
  
  
  observe({
    proxy <- leafletProxy("map", data = n)
    
    
    proxy %>% clearControls()
    if (input$legend) {
      pal <- colorpal()
      proxy %>% addLegend(position = "topright", title = "Clusters",
                          pal = pal, values = ~PAMclustersd
      )
    }
  })  
  
}

shinyApp(ui, server)